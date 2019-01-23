NoIp server app

API end points:

GET http://noip.my-domain.com/check-service-status
Returns OK your ip: x.x.x.x

GET http://noip.my-domain.com/redirect/:compName  
Returns response with redirection.

GET http://noip.my-domain.com/ip/:compName  
Returns latest saved ip for given compName.

GET http://noip.my-domain.com/change-history/:compName
Returns json with all ip changes for given computer name.

POST http://noip.my-domain.com/register  
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

POST http://noip.my-domain.com/ip-update-check/  
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

Table: comp
id compName secretKeyHash

Table: ip_mapping
id compName ip timeStamp

Table: ip_change_log
id compName ipOld ipNew timeStamp

ADDITIONAL INFO

- When server is running and clinet makes request for the first time (in current instance of server run), server needs to make a hash from received secret key and compare it with the one in database. If it matches, then server caches client secret into array and uses this array for furder checks of client secret.
  This way it is not cpu intens, we only make hash when request is made for the first time (in current instance of server run).

TODO

- Option to show / redirect only after user enters password.
- Periodicaly checking for very old ip mappings and then delet them and also registered compName-s.
