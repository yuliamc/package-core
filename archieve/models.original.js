'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const db = {};

const config = {
    dialect: 'mysql',
    dialectOptions: {
        useUTC: false,
        dateStrings: true,
        typeCast: function (field, next) {
            if (field.type === 'DATETIME') {
                return field.string()
            }
            return next()
        }
    },
    timezone: (process.env.TZ ? process.env.TZ : 'Asia/Jakarta'),
    logging: (process.env.DB_LOGGING ? console.log : false),
    operatorsAliases: false,
    pool: {
        max: 100,
        min: 1,
        acquire: 30000,
        idle: 10000
    }
};

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, config);

fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// https://github.com/sequelize/express-example/blob/master/models/index.js
// https://stackoverflow.com/questions/47367893/sequelize-reads-datetime-in-utc-only