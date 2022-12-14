'use strict';

process.env.SERVERLESS_URL = 'https://example.com';


const test = require('ava');
const sinon = require('sinon');

const Methods = require('../../policy');

// Initial setup and mock request and connection //

let sandbox;
let res;

test.beforeEach(() => {
    sandbox = sinon.createSandbox();
    res = {
        status: status => ({
            json: json => ({
                status,
                json
            })
        })
    };
});

test.afterEach.always(() => {
    sandbox.restore();
});

// Unit test section, please put your code below //

test.serial('has should return async function', async (t) => {
    try {
        const result = await Methods.has();

        const AsyncFunction = (async () => {}).constructor;
        t.deepEqual(typeof result, 'function');
        t.true(result instanceof AsyncFunction);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('has should return 403 when request has no session', async (t) => {
    try {
        const req = { session: null };
        const next = sandbox.spy();
        const result = await Methods.has()(req, res, next);

        t.deepEqual(result.status, 403);
        t.deepEqual(result.json, { message: 'You are not authorized to access this resource!' });
        t.true(next.notCalled);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('has should return 403 when request has no session admin', async (t) => {
    try {
        const req = { session: { admin: null } };
        const next = sandbox.spy();
        const result = await Methods.has()(req, res, next);

        t.deepEqual(result.status, 403);
        t.deepEqual(result.json, { message: 'You are not authorized to access this resource!' });
        t.true(next.notCalled);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('has should return 403 when request has no session admin policies', async (t) => {
    try {
        const req = { session: { admin: { policies: null } } };
        const next = sandbox.spy();
        const result = await Methods.has()(req, res, next);

        t.deepEqual(result.status, 403);
        t.deepEqual(result.json, { message: 'You are not authorized to access this resource!' });
        t.true(next.notCalled);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('has should return 403 when page policies is not string', async (t) => {
    try {
        const policies = { crm_lender: 123 };
        const req = { session: { admin: { policies } } };
        const next = sandbox.spy();
        const result = await Methods.has('crm_lender')(req, res, next);

        t.deepEqual(result.status, 403);
        t.deepEqual(result.json, { message: 'You are not authorized to access this resource!' });
        t.true(next.notCalled);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('has should return 403 when page policies do not contain any requested policy at all', async (t) => {
    try {
        const policies = { crm_lender: 'ABCD' };
        const req = { session: { admin: { policies } } };
        const next = sandbox.spy();
        const result = await Methods.has('crm_lender', 'E')(req, res, next);

        t.deepEqual(result.status, 403);
        t.deepEqual(result.json, { message: 'You are not authorized to access this resource!' });
        t.true(next.notCalled);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('has should return 403 when page policies do not contain all requested policies', async (t) => {
    try {
        const policies = { crm_lender: 'ABCD' };
        const req = { session: { admin: { policies } } };
        const next = sandbox.spy();
        const result = await Methods.has('crm_lender', 'AE')(req, res, next);

        t.deepEqual(result.status, 403);
        t.deepEqual(result.json, { message: 'You are not authorized to access this resource!' });
        t.true(next.notCalled);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('has should return next when page policies contain all requested policies', async (t) => {
    try {
        const policies = { crm_lender: 'ABCD' };
        const req = { session: { admin: { policies } } };
        const next = sandbox.spy(() => 12345);
        const result = await Methods.has('crm_lender', 'CD')(req, res, next);
        t.deepEqual(result, 12345);
        t.true(next.calledOnce);
    } catch (err) {
        throw new Error(err.message);
    }
});
