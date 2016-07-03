# Automigrate does not create the db itself
CREATE DATABASE  IF NOT EXISTS `coreMysqlTEST`;

# We grant a fake permission because IF EXIST is supported from 5.7 onwards, actual db is 5.6
# https://coderwall.com/p/aqac0w/mysql-would-you-please-drop-user-if-exists
# http://dev.mysql.com/doc/refman/5.7/en/drop-user.html
GRANT USAGE ON *.* TO 'testcoreapi'@'localhost';
DROP USER 'testcoreapi'@'localhost';
CREATE USER `testcoreapi`@`localhost` IDENTIFIED BY 'testcoreapipassword';

# All priviliges for coremysql db
GRANT ALL PRIVILEGES ON `coreMysqlTEST`.* TO `testcoreapi`@`localhost`;

# Read only (select and show view) for peermatchTEST
GRANT SELECT ON `peermatchTEST`.* TO `testcoreapi`@`localhost`;
GRANT SHOW VIEW ON `peermatchTEST`.* TO `testcoreapi`@`localhost`;

# Read only for portalTEST
GRANT SELECT ON `portalTEST`.* TO `testcoreapi`@`localhost`;
GRANT SHOW VIEW ON `portalTEST`.* TO `testcoreapi`@`localhost`;