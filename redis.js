'use strict';

const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

let client = {};
const url = process.env.REDIS_CONNECTION_STRING;
const tls = process.env.REDIS_TLS_ENABLED;

if (url) {
    const config = {
        retry_strategy(options) {
            client = {};
            if (options.error && options.error.code === 'ECONNREFUSED') {
                return new Error('The redis server refused the connection');
            }
            if (options.error && options.error.code === 'ECONNRESET') {
                return new Error('The redis server reset the connection');
            }
            if (options.error && options.error.code === 'ETIMEDOUT') {
                return new Error('The redis server timeouted the connection');
            }
            if (options.total_retry_time > 1) {
                return new Error('The Redis server retry time exhausted');
            }
            if (options.attempt > 1) {
                return new Error('The Redis server maximum attempted');
            }
            return new Error('The Redis server connection dropped');
        }
    };

    if (tls && (tls === '1' || tls.trim().toLowerCase() === 'true')) {
        config.tls = {
            checkServerIdentity: () => undefined
        };
    }

    client = redis.createClient(url, config);
}

module.exports = client;

// Please always use setAsync and getAsync to use redis especially run in shell or cronjob
// await Redis.setAsync('foo', 'bar', 'EX', 60);
// await Redis.getAsync('foo');
// await Redis.expireAsync('foo, 60);
// await Redis.delAsync('foo');
