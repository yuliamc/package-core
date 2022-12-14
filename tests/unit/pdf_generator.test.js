'use strict';

process.env.SERVERLESS_URL = 'https://example.com';
process.env.SMSTRAP = '08891111111211';

const test = require('ava');
const sinon = require('sinon');
const Axios = require('axios');

const Methods = require('../../pdf_generator');

// Define Dummy Data Here

const emailRequestParam = {
    to: ['harryanto@modalrakyat.id'],
    from: 'noreply@modalrakyat.id',
    template: 'sample',
    content: {
        tes: 'tes'
    }
};

const PDFRequestParam = {
    template: 'lender_agreement_letter',
    content: {
        tes: 'tes'
    },
    file_name: 'tes.pdf',
    email: emailRequestParam
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


test.serial('Should send pdf with email', async (t) => {
    sandbox.stub(Axios, 'post').resolves(dummyAxiosResponse);

    try {
        const result = await Methods.send(PDFRequestParam);

        const expected = dummyResponse;
        t.deepEqual(result, expected);
    } catch (err) {
        throw new Error(err.message);
    }
});

