const db = require("../db/models");
const bcrypt = require("bcryptjs");
const auth = require("../utilities/auth");
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("OK");
});

router.get("/check-service-status", (req, res) => {
  const clientIp = req.clientIp;
  res.send("OK your ip: " + clientIp);
});

router.post("/register", async (req, res) => {
  const reqCompName = req.body.compName;
  const reqSecretKey = req.body.secretKey;
  const existingComp = await db.Comp.findOne({
    where: { compName: reqCompName }
  });

  if (existingComp) {
    return res.send({
      success: false,
      msg: "Computer name already exists."
    });
  }

  const secretKeyHash = bcrypt.hashSync(reqSecretKey, 10);

  // Create new computer name with secret key.
  await db.Comp.create({
    compName: reqCompName,
    secretKeyHash
  });
  // Insert empty ip mapping.
  await db.IpMapping.create({
    compName: reqCompName,
    ip: "0.0.0.0"
  });

  res.send({ success: true });
});

router.post("/ip-update-check", async (req, res) => {
  const reqCompName = req.body.compName;
  const reqSecretKey = req.body.secretKey;
  const clientIp = req.clientIp;

  // Check if client secret matches with the one in the dastabase.
  const clientAuthOK = auth.checkClientAuthentication(
    reqCompName,
    reqSecretKey
  );
  if (!clientAuthOK) {
    return res.status(401).send("not authenticated");
  }

  const compNameIpMapping = await db.IpMapping.findOne({
    where: { compName: reqCompName },
    raw: false // whole Sequelize object, not just my data
  });

  // Check if current client ip is new.
  if (clientIp !== compNameIpMapping.ip) {
    // Create change log.
    await db.IpChangeLog.create({
      compName: reqCompName,
      ipOld: compNameIpMapping.ip,
      ipNew: clientIp,
      timeStamp: db.sequelize.literal("CURRENT_TIMESTAMP")
    });
    // Save new mapping.
    await compNameIpMapping.update({
      ip: clientIp,
      timeStamp: db.sequelize.literal("CURRENT_TIMESTAMP")
    });
    res.send({
      changed: true,
      newIp: clientIp
    });
  } else {
    res.send({ changed: false });
  }
});

router.get("/redirect/:compName/:port/:path?", async (req, res) => {
  const reqCompName = req.params.compName;
  const reqPort = req.params.port || "";
  const reqPath = req.params.path || "";

  const compNameIpMapping = await db.IpMapping.findOne({
    where: { compName: reqCompName }
  });

  const redirectPort = reqPort.length !== 0 ? `:${reqPort}` : "";
  const redirectPath = reqPath.length !== 0 ? `/${reqPath}` : "";

  if (!compNameIpMapping) return res.status(404).send("Not found");
  else
    return res
      .status(302)
      .redirect(`http://${compNameIpMapping.ip}${redirectPort}${redirectPath}`);
  // A 301 redirect means that the page has permanently moved to a new location.
  // A 302 redirect means that the move is only temporary.
  // We are going to use 302, since the ip will change.
});

router.get("/ip/:compName", async (req, res) => {
  const reqCompName = req.params.compName;
  const compNameIpMapping = await db.IpMapping.findOne({
    where: { compName: reqCompName }
  });

  if (!compNameIpMapping) return res.status(404).send("Not found");
  else res.send({ ip: compNameIpMapping.ip });
});

router.get("/change-history/:compName", async (req, res) => {
  const reqCompName = req.params.compName;
  const changeHistory = await db.IpChangeLog.findAll({
    where: { compName: reqCompName }
  });

  if (!changeHistory) return res.status(404).send("Not found");
  else res.send(changeHistory);
});

module.exports = router;
