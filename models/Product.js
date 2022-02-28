const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');
const Category = require('./Category');

class Product extends Model {}


Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validators: { isDecimal: true }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: (10),
      validators: { isInt: true }
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: 'id'
      },  
    
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Product',
  }
);

module.exports = Product;
