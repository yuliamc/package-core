'use strict';

exports.lowerTrim = function (string) {
    return string.toLowerCase().trim();
};

exports.upperTrim = function (string) {
    return string.toUpperCase().trim();
};

exports.nullable = function (input) {
    if (input === null ||
        input === '' ||
        input === ' ' ||
        input === {} ||
        input === [] ||
        typeof input === 'undefined'
    ) {
        return null;
    }
    return input.trim();
};

exports.implode = function (data, delimeter) {
    if (data.length === 0) {
        return '';
    }
    return data.join(delimeter);
};

exports.isNumber = function (x) {
    if (typeof x === 'number') {
        return true;
    }
    return x.match(/^[0-9]+$/);
};

exports.slugify = function (string) {
    if (string === null || string === '' || typeof string === 'undefined') {
        return '';
    }
    let url = string.toLowerCase().trim();
    url = url.replace(' / ', ' ');
    url = url.replace(' & ', '-');
    url = url.replace(/ /g, '-');
    url = url.replace(/--/g, '-');
    url = url.replace(/[^\w.]/g, '-');
    url = url.replace(/--/g, '-');
    url = url.replace(/-_/g, '_');
    return url;
};

exports.parseDataObject = function (object) {
    return JSON.parse(JSON.stringify(object));
};

exports.offsetPagination = function (page, limit) {
    const pg = page ? parseInt(page) : 1;
    const lm = parseInt(limit);
    const offset = ((pg - 1) * lm);
    return offset || 0;
};

exports.convertToArray = function (data) {
    if (data === null || data === '' || typeof data === 'undefined') {
        return [];
    }

    return JSON.parse(data);
};

exports.initialName = function (string) {
    if (string === null || string === '' || typeof string === 'undefined') {
        return '';
    }
    return string.toUpperCase().split(' ').map(n => n[0]).join('');
};

exports.fileExtension = function (url) {
    return url.split(/#|\?/)[0].split('.').pop().trim();
};

exports.bankCheckerNameValidation = function (input, bankSource) {
    let inputName = input.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
    let bankSourceName = bankSource.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
    if (inputName === bankSourceName) {
        return true;
    }

    // Notes: Source must be the name without salutation
    const salutation = ['pt', 'cv', 'bpk', 'ibu', 'mr', 'mrs', 'ms', 'tn', 'ny', 'prof', 'sdr', 'sdri'];
    const salutationRegex = new RegExp(`\\b(${salutation.join('|')})\\b`, 'i');
    inputName = inputName.replace(salutationRegex, '').trim();
    bankSourceName = bankSourceName.replace(salutationRegex, '').trim();
    if (inputName === bankSourceName) {
        return true;
    }

    const arrSourceWords = inputName.split(' ');
    const arrResultWords = bankSourceName.split(' ');
    const lenSourceWords = arrSourceWords.length;
    if (lenSourceWords === 1 && arrSourceWords[0].toLowerCase() !== arrResultWords[0].toLowerCase()) {
        return false;
    }

    inputName = inputName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    bankSourceName = bankSourceName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (inputName.length !== bankSourceName.length) {
        const shorterNum = Math.min(inputName.length, bankSourceName.length);
        inputName = inputName.substring(0, shorterNum);
        bankSourceName = bankSourceName.substring(0, shorterNum);
    }
    if (inputName === bankSourceName) {
        return true;
    }

    return false;
};

module.exports = exports;
