# In Stale state. Waiting for the release of loopback 3.0. 
# The boilerplate as now is functional, the deps although are not stable.

##Development:

1. create `.dev` file

    ```
    DEBUG='boilerplate:*'
    ``` 
1. `npm run start.local`

1. api explorer `http://localhost:3000/explorer`

1. copy and paste the `id` field in the response to "Set access token" at the top right 

###Postman

1. import `http://localhost:3000/explorer/swagger.json`

###From Boiler plate to working code

1. Code.
    1. rename user model name (now 'MyUser' is been used). 
    1. reame 'boilerplate' in debug assertion into the name of your project.

1. Tests

    1. add test users and test roles at https://github.com/redbabel/loopback-boilerplate/blob/master/test/dbUtils.js
    1. TBD 




