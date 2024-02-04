import mysqlx from '@mysql/xdevapi';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT || '33060'),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  schema: process.env.DB_SCHEMA!
};

async function getConnection() {
  try {
    const session = await mysqlx.getSession(config);
    console.log('Database connection successful');
    return session;//.getSchema(config.schema);
  } catch (error) {
    console.error('Database connection failed', error);
    throw error;
  }
}

export default getConnection;