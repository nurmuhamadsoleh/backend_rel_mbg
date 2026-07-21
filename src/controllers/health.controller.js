const { checkDatabaseConnection } = require('../services/database-health.service');
const { errorResponse, successResponse } = require('../utils/response');

async function database(req, res) {
  try {
    const connection = await checkDatabaseConnection();

    return successResponse(res, 'MySQL berhasil terhubung', {
      status: 'connected',
      ...connection
    });
  } catch (error) {
    return errorResponse(res, 'MySQL gagal terhubung', {
      status: 'disconnected',
      message: error.message
    }, 503);
  }
}

module.exports = {
  database
};
