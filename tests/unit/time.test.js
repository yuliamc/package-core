'use strict';

process.env.SERVERLESS_URL = 'https://example.com';


const test = require('ava');
const sinon = require('sinon');
const moment = require('moment');

const Methods = require('../../time');


// Initial setup and mock request and connection //

let sandbox;
let clock;
const now = new Date();


test.beforeEach(() => {
    sandbox = sinon.createSandbox();
    clock = sinon.useFakeTimers(now.getTime());
});

test.afterEach.always(() => {
    sandbox.restore();
    clock.restore();
});

// Unit test section, please put your code below //

test.serial('Should return now with default format', async (t) => {
    try {
        const nowDefault = moment(now).format('YYYY-MM-DD HH:mm:ss');
        const result = await Methods.now();
        t.deepEqual(result, nowDefault);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return now with requested format', async (t) => {
    try {
        const nowFormatted = moment(now).format('MM-DD-YYYY HH:mm');
        const result = await Methods.now('MM-DD-YYYY HH:mm');
        t.deepEqual(result, nowFormatted);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return today with default format', async (t) => {
    try {
        const todayDefault = moment(now).format('YYYY-MM-DD');
        const result = await Methods.today();
        t.deepEqual(result, todayDefault);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return today with requested format', async (t) => {
    try {
        const todayFormatted = moment(now).format('DD-MM-YYYY');
        const result = await Methods.today('DD-MM-YYYY');
        t.deepEqual(result, todayFormatted);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return date from isodate with default format', async (t) => {
    try {
        const nowDefault = moment(now).format('YYYY-MM-DD HH:mm:ss');
        const result = await Methods.isoDateToDateTime(now);
        t.deepEqual(result, nowDefault);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return date from isodate with requested format', async (t) => {
    try {
        const nowDefault = moment(now).format('DD-MM-YYYY HH:mm');
        const result = await Methods.isoDateToDateTime(now, 'DD-MM-YYYY HH:mm');
        t.deepEqual(result, nowDefault);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return empty from isodate with empty', async (t) => {
    try {
        const result = await Methods.isoDateToDateTime('', 'DD-MM-YYYY HH:mm');
        t.deepEqual(result, '');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return date difference', async (t) => {
    try {
        const result = await Methods.datediff('2018-11-01', '2018-10-20', 'days');
        t.deepEqual(result, 12);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return date difference with other measurement', async (t) => {
    try {
        const result = await Methods.datediff('2018-11-01', '2018-10-20', 'other');
        t.deepEqual(result, 1036800000);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return date difference without measurement parameter', async (t) => {
    try {
        const result = await Methods.datediff('2018-11-01', '2018-10-20');
        t.deepEqual(result, 12);
    } catch (err) {
        throw new Error(err.message);
    }
});


test.serial('Should return new date with date added ', async (t) => {
    try {
        const result = await Methods.dateadd('2018-10-01', 7, 'days', 'YYYY-MM-DD');
        t.deepEqual(result, '2018-10-08');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return new date with date added without parameter ', async (t) => {
    try {
        const result = await Methods.dateadd('2018-10-01', 7);
        t.deepEqual(result, '2018-10-08');
    } catch (err) {
        throw new Error(err.message);
    }
});

