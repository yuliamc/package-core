'use strict';

process.env.SERVERLESS_URL = 'https://example.com';
process.env.SMSTRAP = '08891111111211';

const test = require('ava');
const sinon = require('sinon');
const Axios = require('axios');

const Methods = require('../../notification');

// Define Dummy Data Here

const emailRequestParam = {
    to: ['harryanto@modalrakyat.id'],
    from: 'noreply@modalrakyat.id',
    template: 'sample',
    content: {
        tes: 'tes'
    }
};

const dummyAxiosResponse = {
    data: {
        SendMessageResponse: {
            ResponseMetadata: {
                RequestId: '82b9cd1a-5030-54bb-8d3b-991327fe4e3b'
            },
            SendMessageResult: {
                MD5OfMessageAttributes: null,
                MD5OfMessageBody: '12fd125f00d0390b15a2566d903335d1',
                MessageId: 'b2f1ee11-7435-48b4-8ced-fbc40e6b7f63',
                SequenceNumber: null
            }
        }
    }
};

const dummyResponse = {
    SendMessageResponse: {
        ResponseMetadata: {
            RequestId: '82b9cd1a-5030-54bb-8d3b-991327fe4e3b'
        },
        SendMessageResult: {
            MD5OfMessageAttributes: null,
            MD5OfMessageBody: '12fd125f00d0390b15a2566d903335d1',
            MessageId: 'b2f1ee11-7435-48b4-8ced-fbc40e6b7f63',
            SequenceNumber: null
        }
    }
};

// Initial setup and mock request and connection //

let sandbox;

test.beforeEach(() => {
    sandbox = sinon.createSandbox();
});

test.afterEach.always(() => {
    sandbox.restore();
});

// Unit test section, please put your code below //


test.serial('Should send email', async (t) => {
    sandbox.stub(Axios, 'post').resolves(dummyAxiosResponse);

    try {
        const result = await Methods.email(emailRequestParam);

        const expected = dummyResponse;
        t.deepEqual(result, expected);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should send sms', async (t) => {
    sandbox.stub(Axios, 'post').resolves(dummyAxiosResponse);

    try {
        const result = await Methods.sms('0889111111111', 'Test SMS', 'kingsms');

        const expected = dummyResponse;
        t.deepEqual(result, expected);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should throw error when smstrap not defined in development', async (t) => {
    try {
        delete process.env.SMSTRAP;
        const error = await t.throws(() => {
            Methods.sms('0889111111111', 'Test SMS', 'kingsms');
        }, Error);

        t.is(error.message, 'SMSTRAP environment variable for non production must provided!');
    } catch (err) {
        throw new Error(err.message);
    }
});

