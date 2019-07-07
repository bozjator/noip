NoIp  
The purpose of this NodeJS project is to be able to access a computer which does not have a static ip.  
Project has two apps, server and client app. So, you will still need a server with static address / domain, on which you will run server app. And through this server app API you will be able to redirect to your computer.  
And on your computer you will run client app, which will periodically check for ip changes and then update new ip on your server app.  
 
Database  
This project uses Sequelize.  
To initialize database, create database called noip and call script re-set-database.js inside server-app folder. 
 
NoIp client app:  
Before you run client app, you should setup some environment variables that are used in clinet app, inside index.js  
NOIP_SERVER_URL - address where server app API is accessible  
NOIP_CLIENT_NAME - name of your computer, which you will use in API calls  
NOIP_CLIENT_SECRET - your client app secret, will prevent another person to run client app with the same computer name  

NoIp server app:  
API end points:

GET https://noip.my-domain.com/check-service-status  
Returns OK your ip: x.x.x.x

GET https://noip.my-domain.com/redirect/:compName/:port?/:path?  
Returns response with redirection. Port and path are optional.

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
 newIp: x.x.x.x  
}  
Response if ip was not changed:  
{  
 changed: false  
}  
Response if client secret does not matches:  
401: "not authenticated" 

TODO

- Option to show / redirect only after user enters password.
- Periodicaly checking for very old ip mappings and then delet them and also registered compName-s.
