# Automigrate does not create the db itself
CREATE DATABASE  IF NOT EXISTS `boilerplateTEST`;

# We grant a fake permission because IF EXIST is supported from 5.7 onwards, actual db is 5.6
# https://coderwall.com/p/aqac0w/mysql-would-you-please-drop-user-if-exists
# http://dev.mysql.com/doc/refman/5.7/en/drop-user.html
GRANT USAGE ON *.* TO 'testboilerplate'@'localhost';
DROP USER 'testboilerplate'@'localhost';
CREATE USER `testboilerplate`@`localhost` IDENTIFIED BY 'testboilerplatepassword';

# All priviliges for boilerplate db
GRANT ALL PRIVILEGES ON `boilerplateTEST`.* TO `testboilerplate`@`localhost`;

