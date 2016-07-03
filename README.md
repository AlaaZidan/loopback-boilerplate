##Development:

1. create `.dev` file

    ```
    coreMysqlUser=
    coreMysqlPassword=
    coreMysqlHost=
    coreMysqlDatabase=

    ``` 
1. `npm run start.local`

1. api explorer `http://localhost:3000/explorer`

1. copy and paste the `id` field in the response to "Set access token" at the top right 

###Postman

1. import `http://localhost:3000/explorer/swagger.json`

###From Boiler plate to working code

1. tests

    1. add test users and test roles at https://github.com/redbabel/loopback-boilerplate/blob/master/test/dbUtils.js

    1. add database populate scripts in https://github.com/redbabel/loopback-boilerplate/tree/master/test/db_populate_data
    1. modify `before((done)` in the test https://github.com/redbabel/loopback-boilerplate/tree/master/test/db_populate_data files https://github.com/redbabel/loopback-boilerplate/blob/master/test/models adding the files in https://github.com/redbabel/loopback-boilerplate/tree/master/test/db_populate_data 
    1. implement other tests if needed (https://github.com/redbabel/loopback-boilerplate/tree/master/test)

1. implement Soul.login() at https://github.com/redbabel/loopback-boilerplate/blob/master/common/models/soul.js



