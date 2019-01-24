NoIp server app

API end points:

GET https://noip.my-domain.com/check-service-status  
Returns OK your ip: x.x.x.x

GET https://noip.my-domain.com/redirect/:compName  
Returns response with redirection.

GET https://noip.my-domain.com/ip/:compName  
Returns latest saved ip for given compName.

GET https://noip.my-domain.com/change-history/:compName  
Returns json with all ip changes for given computer name.

POST https://noip.my-domain.com/register  
body:  
{  
 compName: "some-client-computer-name",  
 secretKey: "secret-of-this-client"  
}  
Saves client computer name and hashed password.
Responses:  
Response if user does not exist yet:
{  
 success: true  
}  
Response if client computer alreay exists:
{  
 success: false,  
 msg: "This client computer already exists.  
}

POST https://noip.my-domain.com/ip-update-check/  
body:  
{  
 compName: "some-client-computer-name",  
 secretKey: "secret-of-this-client"  
}  
Checks if ip for that computer was changed and updates it if it was.  
Responses:  
Response if ip was changed:  
{  
 changed: true,  
 newIp: 0.0.0.0  
}  
Response if ip was not changed:  
{  
 changed: false  
}  
Response if client secret does not matches:  
401: "not authenticated"

DATABASE  
This project uses Sequelize.  
To initialize database, create database called noip and call script re-set-database.js inside server-app folder.

TODO

- Option to show / redirect only after user enters password.
- Periodicaly checking for very old ip mappings and then delet them and also registered compName-s.
