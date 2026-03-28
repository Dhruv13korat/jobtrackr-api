import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

// Define attributes
interface UserAttributes {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
}

// Define attributes required for creation (id is auto-generated)
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare password_hash: string;
  declare first_name: string;
  declare last_name: string;
  declare role: 'user' | 'admin';
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
    beforeCreate: async (user: User) => {
      const password = user.getDataValue('password_hash');
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.setDataValue('password_hash', await bcrypt.hash(password, salt));
      }
    },
    beforeUpdate: async (user: User) => {
      if (user.changed('password_hash')) {
        const password = user.getDataValue('password_hash');
        if (password) {
          const salt = await bcrypt.genSalt(10);
          user.setDataValue('password_hash', await bcrypt.hash(password, salt));
        }
      }
    }
  }
  }
);

export default User;