import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

interface JobAttributes {
  id: string;
  company_name: string;
  job_title: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  application_date: Date;
  job_description_url?: string;
  salary_range?: string;
  location?: string;
  user_id: string;
}

interface JobCreationAttributes extends Optional<JobAttributes, 'id'> {}

class JobApplication extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  declare id: string;
  declare company_name: string;
  declare status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  declare job_title: string;
  declare application_date: Date;
  declare job_description_url?: string;
  declare salary_range?: string;
  declare location?: string;
  declare user_id: string;
}

JobApplication.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company_name: { type: DataTypes.STRING, allowNull: false },
    job_title: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM('Applied', 'Interview', 'Offer', 'Rejected'),
      defaultValue: 'Applied',
    },
    application_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    job_description_url: { type: DataTypes.STRING },
    salary_range: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  { sequelize, tableName: 'job_applications' }
);

// Define Association
User.hasMany(JobApplication, { foreignKey: 'user_id' });
JobApplication.belongsTo(User, { foreignKey: 'user_id' });

export default JobApplication;