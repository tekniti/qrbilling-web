QR Billing WEB
===================


#Deployment
 - Run `grunt build`
 - Run `grunt buildcontrol:openshift`
 
## Deploy the app
Use the `rhc` cli tool to work with openshift
Ssh to the remote server `ssh 55e74d532d527112a90001b3@qrbillingweb-qrbilling.rhcloud.com`

## MongoDB usefulness
`> show dbs`  
`> use qrbillingweb`  
`> show collections`  
`> db.users.find({email: 'test@test.com'})`
`> db.users.update({email:'test@test.com'}, {$set: {stripeCustomerId: undefined}})`
