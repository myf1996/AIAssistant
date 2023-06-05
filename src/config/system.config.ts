const dotenv = require('dotenv');
dotenv.config();

export const systemConfig = {
  port: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'dev',
  project_name: process.env.PROJECT_NAME,
  database: {
    db_host: process.env.DB_HOST,
    db_port: 5432,
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    db_database: process.env.DB_DATABASE,
    db_synchronize: process.env.NODE_ENV || 'dev' === 'dev' ? true : false,
    fetch_data_with_deleted: false,
  },
  application: {
    frontend_base_url: process.env.APPLICATION_FRONTEND_URL,
    backend_base_url: process.env.APPLICATION_BACKEND_URL,
  },
  jwt: {
    secret_key: process.env.JWT_SECRET_KEY,
    expire_in: process.env.JWT_EXPIRE_IN,
  },
  sendgrid: {
    api_key: process.env.SENDGRID_API_KEY,
    mail_from: process.env.SENDGRID_MAIL_FROM,
  },
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket_name: process.env.AWS_BUCKET_NAME,
  },
  hash: {
    salt: process.env.HASH_SALT,
    length: process.env.HASH_LENGTH,
  },
  openai: {
    api_key: process.env.OPENAI_CHATGPT_API_KEY,
  },
  sentry_url: process.env.SENTRY_URL,
};
