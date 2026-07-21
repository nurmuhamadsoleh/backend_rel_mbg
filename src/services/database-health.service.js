const sequelize = require('../config/database');

async function checkDatabaseConnection() {
  const startedAt = Date.now();

  await sequelize.authenticate();

  return {
    dialect: sequelize.getDialect(),
    host: sequelize.config.host,
    port: sequelize.config.port,
    database: sequelize.config.database,
    responseTimeMs: Date.now() - startedAt
  };
}

module.exports = {
  checkDatabaseConnection
};
