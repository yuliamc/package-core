'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');


const db = {};
const basename = 'index.js';
const url = process.env.DB_CONNECTION_STRING;
const dirname = `${__dirname}/../../src/models`;
const timezoneOffset = require('./timezone_offset.json');


const config = {
    dialect: 'mysql',
    dialectOptions: {
        // useUTC: false, // deprecated
        dateStrings: true,
        decimalNumbers: true,
        typeCast(field, next) {
            if (field.type === 'DATETIME') {
                return field.string();
            }
            return next();
        }
    },
    timezone: (process.env.TZ ? (timezoneOffset[process.env.TZ] || '+07:00') : '+07:00'),
    logging: (process.env.DB_LOGGING ? console.log : false),
    operatorsAliases: false,
    pool: {
        max: (process.env.MYSQL_MAX_POOL ? parseInt(process.env.MYSQL_MAX_POOL) : 100),
        min: 1,
        acquire: 30000,
        idle: 10000
    }
};

if (url) {
    const sequelize = new Sequelize(url, config);

    fs.readdirSync(dirname)
        .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
        .forEach((file) => {
            const model = sequelize.import(path.join(dirname, file));
            db[model.name] = model;
        });

    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
}

module.exports = db;

// https://github.com/sequelize/express-example/blob/master/models/index.js
// https://stackoverflow.com/questions/47367893/sequelize-reads-datetime-in-utc-only
