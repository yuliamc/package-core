'use strict';

const moment = require('moment');

// The supported measurements are years, months, weeks, days, hours, minutes, and seconds

exports.now = function (format = '') {
    if (format) {
        return moment(new Date()).format(format);
    }
    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
};

exports.today = function (format = '') {
    if (format) {
        return moment(new Date()).format(format);
    }
    return moment(new Date()).format('YYYY-MM-DD');
};

exports.isoDateToDateTime = function (isoDate, format = '') {
    if (isoDate === null ||
        isoDate === '' ||
        typeof isoDate === 'undefined'
    ) {
        return isoDate;
    }
    if (format) {
        return moment(isoDate).format(format);
    }
    return moment(isoDate).format('YYYY-MM-DD HH:mm:ss');
};

exports.datediff = function (date1, date2, measurement = 'days') {
    let a = '';
    let b = '';

    if (measurement === 'years' ||
        measurement === 'months' ||
        measurement === 'weeks' ||
        measurement === 'days') {
        a = moment(date1.substr(0, 10));
        b = moment(date2.substr(0, 10));
    } else {
        a = moment(date1);
        b = moment(date2);
    }

    return Math.abs(a.diff(b, measurement));
};

exports.dateadd = function (date, interval, measurement = 'days', format = 'YYYY-MM-DD') {
    return moment(date).add(interval, measurement).format(format);
};

module.exports = exports;
