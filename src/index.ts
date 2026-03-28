import express, { type Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import './models/User.js'; 
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');

    // sync({ alter: true }) updates tables to match models without deleting data
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized.');

    app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
};

startServer();