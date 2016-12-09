# Automigrate does not create the db itself
CREATE DATABASE  IF NOT EXISTS `testdb`;

# We grant a fake permission because IF EXIST is supported from 5.7 onwards, actual db is 5.6
# https://coderwall.com/p/aqac0w/mysql-would-you-please-drop-user-if-exists
# http://dev.mysql.com/doc/refman/5.7/en/drop-user.html
GRANT USAGE ON *.* TO 'testuser'@'localhost';
DROP USER 'testuser'@'localhost';
CREATE USER `testuser`@`localhost` IDENTIFIED BY 'testuserpassword';

# All priviliges for testdb db
GRANT ALL PRIVILEGES ON `testdb`.* TO `testuser`@`localhost`;
