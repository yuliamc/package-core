'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const db = {};
const basename = 'index.js';
const url = process.env.MONGO_CONNECTION_STRING;
const dirname = `${__dirname}/../../src/models/mongo`;

const options = {
    connectTimeoutMS: 30000,
    useNewUrlParser: true // remove DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version
};

if (url) {
    mongoose.connect(url, options);

    mongoose.pluralize(null); // disable auto pluralize collection name eg: student to students
    mongoose.set('useFindAndModify', false); // hide & prevent partial deprecation message
    mongoose.set('debug', (process.env.DB_LOGGING || false));

    fs.readdirSync(dirname)
        .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
        .forEach((file) => {
            const model = require(path.join(dirname, file))(mongoose);
            db[model.modelName] = mongoose.model(model.collectionName, model.collectionSchema);
        });

    db.mongoose = mongoose;
}

module.exports = db;
