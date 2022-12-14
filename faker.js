'use strict';

exports.res = function () {
    return {
        send(data) {
            return data;
        },
        json(data) {
            return data;
        },
        status(responseStatus) {
            return {
                json(data) {
                    return data;
                }
            };
        }
    };
};

module.exports = exports;
