import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Professional check: Ensure DB_URL exists
if (!process.env.DB_NAME) {
  throw new Error('DATABASE_NAME is not defined in .env file');
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false, // Set to console.log during debugging if needed
    define: {
      timestamps: true, // Automatically adds createdAt and updatedAt
      underscored: true, // Converts camelCase to snake_case in DB (standard practice)
    },
  }
);

export default sequelize;