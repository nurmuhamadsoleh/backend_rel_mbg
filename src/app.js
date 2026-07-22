const path = require('path');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const { DataTypes } = require('sequelize');
require('dotenv').config();

const routes = require('./routes');
const { sequelize } = require('./models');
const healthController = require('./controllers/health.controller');
const { rejectDangerousPayload } = require('./middlewares/security.middleware');
const { errorResponse, successResponse } = require('./utils/response');

const app = express();
const port = Number(process.env.APP_PORT || 5000);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(rejectDangerousPayload);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req, res) => {
  return successResponse(res, 'Backend CMS REL MBG berjalan', {
    service: 'backend-relmbg',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  return successResponse(res, 'OK', {
    uptime: process.uptime()
  });
});

app.get('/health/database', healthController.database);

app.use('/api', routes);

app.use((req, res) => {
  return errorResponse(res, 'Endpoint tidak ditemukan', [], 404);
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Ukuran file maksimal 5 MB'
      : err.message;
    return errorResponse(res, message, [], 422);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(res, 'Data sudah digunakan', err.errors, 409);
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return errorResponse(res, 'Relasi data tidak valid', [], 422);
  }

  const statusCode = err.status || 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  return errorResponse(res, err.message || 'Terjadi kesalahan server', [], statusCode);
});

async function ensureLocationSchema() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    const table = await queryInterface.describeTable('locations');

    if (!table.level) {
      await queryInterface.addColumn('locations', 'level', {
        type: DataTypes.ENUM('DPW', 'DPD', 'DPC', 'PAC'),
        allowNull: false,
        defaultValue: 'DPC',
        after: 'name'
      });
    }

    if (!table.email) {
      await queryInterface.addColumn('locations', 'email', {
        type: DataTypes.STRING(160),
        allowNull: true,
        after: 'contact_number'
      });
    }
  } catch (error) {
    if (!['ER_NO_SUCH_TABLE', 'ER_BAD_TABLE_ERROR'].includes(error.original?.code)) {
      throw error;
    }
  }
}

async function ensureOrganizationInfoSchema() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    const table = await queryInterface.describeTable('organization_infos');

    if (!table.title) {
      await queryInterface.addColumn('organization_infos', 'title', {
        type: DataTypes.STRING(160),
        allowNull: false,
        defaultValue: 'Kantor Serikat REL MBG',
        after: 'id'
      });
    }
  } catch (error) {
    if (!['ER_NO_SUCH_TABLE', 'ER_BAD_TABLE_ERROR'].includes(error.original?.code)) {
      throw error;
    }
  }
}

async function bootstrap() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await ensureOrganizationInfoSchema();
    await ensureLocationSchema();

    app.listen(port, () => {
      console.log(`Backend CMS REL MBG berjalan di port ${port}`);
    });
  } catch (error) {
    console.error('Gagal terhubung ke database:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap();
}

module.exports = app;
