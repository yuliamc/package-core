'use strict';

const axios = require('axios');

exports.handle = async function (req, res, next, category) {
    if (req.method === 'GET' || req.method === 'OPTIONS') {
        return next();
    }

    res.on('finish', () => {
        if (!req.route) {
            return;
        }
        const statusCode = res.statusCode.toString();
        const prefixStatusCode = parseInt(statusCode.substring(0, 1));
        const stackLayer = req.route.stack.length ? req.route.stack.slice(-1)[0] : null;
        const functionName = stackLayer ? stackLayer.name : '';
        const logTitle = req.logTitle || '';
        if (prefixStatusCode === 2) {
            if (category === 'internal') {
                this.internalActivity(req, res, functionName, logTitle);
            } else if (category === 'partner') {
                this.partnerActivity(req, res, functionName, logTitle);
            } else {
                this.userActivity(req, res, functionName, logTitle);
            }
        } else if (prefixStatusCode === 5) {
            if (category !== 'partner') {
                this.error(req, res, functionName, req.logTitle);
            } else {
                this.partnerError(req, res, functionName, req.logTitle);
            }
        }
    });

    return next();
};

exports.error = async function (req, res, func, title, returndata = {}) {
    setImmediate(() => {
        const collectionName = 'error';

        const payload = {
            function: func,
            title,
            headers: {
                host: req.headers.host || '',
                authorization: req.headers.authorization ? '*******' : '',
                x_forwarded_for: req.headers['x-forwarded-for'] || '',
                user_agent: req.headers['user-agent'],
                accept_language: req.headers['accept-language'] || 'id',
                referer: req.headers.referer || ''
            },
            session: req.session || {},
            request: {
                method: req.method,
                url: req.url,
                base_url: req.baseUrl,
                original_url: req.originalUrl,
                route_path: req.route ? req.route.path : '',
                query: req.query,
                body: req.body,
                params: req.params,
                path: req.path,
                hostname: req.hostname
            },
            response: {
                status_code: res.statusCode,
                status_message: res.statusMessage || ''
            },
            returndata,
            created_at: new Date(),
            updated_at: new Date()
        };

        return axios.post(`${process.env.SERVERLESS_URL}/v1/log`, {
            collection_name: collectionName,
            payload
        }).then(response => response.data);
    });
};

exports.partnerError = async function (req, res, func, title, returndata = {}) {
    setImmediate(() => {
        const collectionName = 'partner_error';
        const partnerSource = req.partnerSource || 'unknown';

        const payload = {
            function: func,
            source: partnerSource,
            title,
            headers: {
                host: req.headers.host || '',
                authorization: req.headers.authorization ? '*******' : ''
            },
            session: req.session || {},
            request: {
                method: req.method,
                url: req.url,
                base_url: req.baseUrl,
                original_url: req.originalUrl,
                route_path: req.route ? req.route.path : '',
                query: req.query,
                body: req.body,
                params: req.params,
                path: req.path,
                hostname: req.hostname
            },
            response: {
                status_code: res.statusCode,
                status_message: res.statusMessage || ''
            },
            returndata,
            created_at: new Date(),
            updated_at: new Date()
        };

        return axios.post(`${process.env.SERVERLESS_URL}/v1/log`, {
            collection_name: collectionName,
            payload
        }).then(response => response.data);
    });
};

exports.internalActivity = async function (req, res, func, title, returndata = {}) {
    setImmediate(() => {
        const collectionName = 'internal_activity';

        const payload = {
            function: func,
            title,
            headers: {
                host: req.headers.host || '',
                authorization: req.headers.authorization ? '*******' : '',
                x_forwarded_for: req.headers['x-forwarded-for'] || '',
                user_agent: req.headers['user-agent'],
                accept_language: req.headers['accept-language'] || 'id',
                referer: req.headers.referer || ''
            },
            session: req.session,
            request: {
                method: req.method,
                url: req.url,
                base_url: req.baseUrl,
                original_url: req.originalUrl,
                route_path: req.route ? req.route.path : '',
                query: req.query,
                body: req.body,
                params: req.params,
                path: req.path,
                hostname: req.hostname
            },
            response: {
                status_code: res.statusCode,
                status_message: res.statusMessage || ''
            },
            returndata,
            created_at: new Date(),
            updated_at: new Date()
        };

        return axios.post(`${process.env.SERVERLESS_URL}/v1/log`, {
            collection_name: collectionName,
            payload
        }).then(response => response.data);
    });
};

exports.userActivity = async function (req, res, func, title, returndata = {}) {
    setImmediate(() => {
        const collectionName = 'user_activity';

        const payload = {
            function: func,
            title,
            headers: {
                host: req.headers.host || '',
                authorization: req.headers.authorization ? '*******' : '',
                x_forwarded_for: req.headers['x-forwarded-for'] || '',
                user_agent: req.headers['user-agent'],
                accept_language: req.headers['accept-language'] || 'id',
                referer: req.headers.referer || ''
            },
            session: req.session || {},
            request: {
                method: req.method,
                url: req.url,
                base_url: req.baseUrl,
                original_url: req.originalUrl,
                route_path: req.route ? req.route.path : '',
                query: req.query,
                body: req.body,
                params: req.params,
                path: req.path,
                hostname: req.hostname
            },
            response: {
                status_code: res.statusCode,
                status_message: res.statusMessage || ''
            },
            returndata,
            created_at: new Date(),
            updated_at: new Date()
        };

        return axios.post(`${process.env.SERVERLESS_URL}/v1/log`, {
            collection_name: collectionName,
            payload
        }).then(response => response.data);
    });
};


exports.partnerActivity = async function (req, res, func, title, returndata = {}) {
    setImmediate(() => {
        const collectionName = 'partner_activity';
        const partnerSource = req.partnerSource || 'unknown';

        const payload = {
            function: func,
            source: partnerSource,
            title,
            headers: {
                host: req.headers.host || '',
                authorization: req.headers.authorization ? '*******' : ''
            },
            session: req.session,
            request: {
                method: req.method,
                url: req.url,
                base_url: req.baseUrl,
                original_url: req.originalUrl,
                route_path: req.route ? req.route.path : '',
                query: req.query,
                body: req.body,
                params: req.params,
                path: req.path,
                hostname: req.hostname
            },
            response: {
                status_code: res.statusCode,
                status_message: res.statusMessage || ''
            },
            returndata,
            created_at: new Date(),
            updated_at: new Date()
        };

        return axios.post(`${process.env.SERVERLESS_URL}/v1/log`, {
            collection_name: collectionName,
            payload
        }).then(response => response.data);
    });
};

exports.userAuthentication = async function (req, res, func, title, session) {
    setImmediate(() => {
        const collectionName = 'authentication';
        const payload = {
            function: func,
            title,
            headers: {
                host: req.headers.host || '',
                authorization: req.headers.authorization ? '*******' : '',
                x_forwarded_for: req.headers['x-forwarded-for'] || '',
                user_agent: req.headers['user-agent'],
                accept_language: req.headers['accept-language'] || 'id',
                referer: req.headers.referer || ''
            },
            session: {
                id: session.id,
                unique_id: session.unique_id,
                name: session.name,
                email: session.email
            },
            request: {
                method: req.method,
                url: req.url,
                base_url: req.baseUrl,
                original_url: req.originalUrl,
                route_path: req.route ? req.route.path : '',
                path: req.path,
                hostname: req.hostname
            },
            response: {
                status_code: res.statusCode,
                status_message: res.statusMessage || ''
            },
            created_at: new Date(),
            updated_at: new Date()
        };

        return axios.post(`${process.env.SERVERLESS_URL}/v1/log`, {
            collection_name: collectionName,
            payload
        }).then(response => response.data);
    });
};

exports.partnerAuthentication = async function (req, res, func, title, session) {
    setImmediate(() => {
        const collectionName = 'partner_authentication';
        const partnerSource = req.partnerSource || 'unknown';

        const payload = {
            function: func,
            source: partnerSource,
            title,
            headers: {
                host: req.headers.host || '',
                authorization: req.headers.authorization ? '*******' : ''
            },
            session: {
                id: session.id,
                unique_id: session.unique_id,
                name: session.name,
                email: session.email
            },
            request: {
                method: req.method,
                url: req.url,
                base_url: req.baseUrl,
                original_url: req.originalUrl,
                route_path: req.route ? req.route.path : '',
                path: req.path,
                hostname: req.hostname
            },
            response: {
                status_code: res.statusCode,
                status_message: res.statusMessage || ''
            },
            created_at: new Date(),
            updated_at: new Date()
        };

        return axios.post(`${process.env.SERVERLESS_URL}/v1/log`, {
            collection_name: collectionName,
            payload
        }).then(response => response.data);
    });
};


exports.logError = function (err, req, category) {
    setImmediate(() => {
        let collectionName = 'error_log';
        if (category === 'partner') {
            collectionName = 'partner_error_log';
        }
        const partnerSource = req.partnerSource || '';
        const serviceName = req.serviceName || 'unknown';

        const stackLayer = req.route.stack.length ? req.route.stack.slice(-1)[0] : null;
        const functionName = stackLayer ? stackLayer.name : '';
        const logTitle = req.logTitle || '';

        const payload = {
            function: functionName,
            source: partnerSource,
            service: serviceName,
            title: logTitle,
            headers: {
                host: req.headers.host || ''
            },
            session: req.session || {},
            request: {
                method: req.method,
                url: req.url,
                base_url: req.baseUrl,
                original_url: req.originalUrl,
                route_path: req.route ? req.route.path : '',
                query: req.query,
                body: req.body,
                params: req.params,
                path: req.path,
                hostname: req.hostname
            },
            error: {
                type: 'error',
                code: err.code,
                message: err.message,
                stack: err.stack
            },
            created_at: new Date(),
            updated_at: new Date()
        };

        return this.pushLog(collectionName, payload);
    });
};


exports.logUnhandleRejection = function (req, category) {
    process.on('unhandledRejection', (reason, promise) => {
        let collectionName = 'error_log';
        if (category === 'partner') {
            collectionName = 'partner_error_log';
        }
        const partnerSource = req.partnerSource || '';
        const serviceName = req.serviceName || 'unknown';

        const stackLayer = req.route.stack.length ? req.route.stack.slice(-1)[0] : null;
        const functionName = stackLayer ? stackLayer.name : '';
        const logTitle = req.logTitle || '';

        const payload = {
            function: functionName,
            source: partnerSource,
            service: serviceName,
            title: logTitle,
            headers: {
                host: req.headers.host || ''
            },
            session: req.session || {},
            request: {
                method: req.method,
                url: req.url,
                base_url: req.baseUrl,
                original_url: req.originalUrl,
                route_path: req.route ? req.route.path : '',
                query: req.query,
                body: req.body,
                params: req.params,
                path: req.path,
                hostname: req.hostname
            },
            error: {
                type: 'unhandled_rejection',
                code: reason.code,
                message: reason.message,
                stack: reason.stack
            },
            created_at: new Date(),
            updated_at: new Date()
        };

        return this.pushLog(collectionName, payload);
    });
};


exports.pushLog = async function (collectionName, logPayload) {
    setImmediate(() => axios.post(`${process.env.SERVERLESS_URL}/v1/log`, {
        collection_name: collectionName,
        payload: {
            ...logPayload,
            created_at: new Date(),
            updated_at: new Date()
        }
    }).then(response => response.data));
};

module.exports = exports;
