const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const models = {};

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: true,
    },
  });
} else if (env === 'development' || !process.env.DATABASE_URL) {
  const logging = env !== 'test';
  sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: `./${env}.sqlite`,
    logging,
  });
} else {
  throw new Error('Cannot setup database connection');
}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
