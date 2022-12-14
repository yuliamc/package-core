'use strict';

exports.has = function (page = '', policies = '') {
    return async function (req, res, next) {
        if (!req.session || !req.session.admin || !req.session.admin.policies
        || !req.session.admin.policies[page]
        || typeof req.session.admin.policies[page] !== 'string'
        || !policies.split('').every(policy => (req.session.admin.policies[page] || '').indexOf(policy) !== -1)) {
            return res.status(403).json({ message: 'You are not authorized to access this resource!' });
        }

        return next();
    };
};

module.exports = exports;
