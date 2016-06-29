module.exports = {
  coreMysql: {
    // 'name': 'coreMysql',
    connector: 'mysql',
    port: 3306,
    host: process.env.coreMysqlHost,
    database: process.env.coreMysqlDatabase,
    user: process.env.coreMysqlUser,
    password: process.env.coreMysqlPassword,
  },
};
