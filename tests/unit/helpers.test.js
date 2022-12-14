'use strict';

process.env.SERVERLESS_URL = 'https://example.com';


const test = require('ava');
const sinon = require('sinon');

const Methods = require('../../helpers');


// Initial setup and mock request and connection //

let sandbox;

test.beforeEach(() => {
    sandbox = sinon.createSandbox();
});

test.afterEach.always(() => {
    sandbox.restore();
});

// Unit test section, please put your code below //

test.serial('Should return lower case of string and trimmed', async (t) => {
    try {
        const result = await Methods.lowerTrim(' TEST ');
        t.deepEqual(result, 'test');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return upper case of string and trimmed', async (t) => {
    try {
        const result = await Methods.upperTrim(' test ');
        t.deepEqual(result, 'TEST');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return null when nullable', async (t) => {
    try {
        const result = await Methods.nullable('');
        t.deepEqual(result, null);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return param when not nullable', async (t) => {
    try {
        const result = await Methods.nullable('test');
        t.deepEqual(result, 'test');
    } catch (err) {
        throw new Error(err.message);
    }
});


test.serial('Should return param when not nullable', async (t) => {
    try {
        const result = await Methods.nullable('test');
        t.deepEqual(result, 'test');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return implode result with delimiter', async (t) => {
    try {
        const result = await Methods.implode(['1a', '2b'], '|');
        t.deepEqual(result, '1a|2b');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return empty form implode result if data empty', async (t) => {
    try {
        const result = await Methods.implode([], '|');
        t.deepEqual(result, '');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return true when param is number text', async (t) => {
    try {
        const result = await Methods.isNumber('1234');
        t.truthy(result);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return true when param is number', async (t) => {
    try {
        const result = await Methods.isNumber(1234);
        t.truthy(result);
    } catch (err) {
        throw new Error(err.message);
    }
});


test.serial('Should return slug from text', async (t) => {
    try {
        const result = await Methods.slugify('cara mendapatkan untung besar');
        t.is(result, 'cara-mendapatkan-untung-besar');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return empty for slug if text not valid', async (t) => {
    try {
        const result = await Methods.slugify(null);
        t.is(result, '');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return offset', async (t) => {
    try {
        const result = await Methods.offsetPagination(2, 20);
        t.is(result, 20);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return offset with empty page', async (t) => {
    try {
        const result = await Methods.offsetPagination('', 20);
        t.is(result, 0);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return name initial', async (t) => {
    try {
        const result = await Methods.initialName('Harry Anto');
        t.is(result, 'HA');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return empty string for name initial if param empty', async (t) => {
    try {
        const result = await Methods.initialName('');
        t.is(result, '');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return array from string json', async (t) => {
    try {
        const result = await Methods.convertToArray('[1,2,3]');
        t.deepEqual(result, [1, 2, 3]);
    } catch (err) {
        throw new Error(err.message);
    }
});


test.serial('Should return empty array from  invalid string json', async (t) => {
    try {
        const result = await Methods.convertToArray(null);
        t.deepEqual(result, []);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should parse object', async (t) => {
    try {
        const result = await Methods.parseDataObject({ a: '1', b: '2' });
        t.deepEqual(result, { a: '1', b: '2' });
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('Should return file extension', async (t) => {
    try {
        const extension = await Methods.fileExtension('https://storage.modalrakyat.id/documents/design.swf');
        t.deepEqual(extension, 'swf');
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('bankCheckerNameValidation, Should return true if data valid', async (t) => {
    try {
        const result = await Methods.bankCheckerNameValidation('tester is true', 'mr.Tester is true');
        t.deepEqual(result, true);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('bankCheckerNameValidation, Should return true', async (t) => {
    try {
        const result = await Methods.bankCheckerNameValidation('nama saya', 'nama saya, se');
        t.deepEqual(result, true);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('bankCheckerNameValidation, Should return true', async (t) => {
    try {
        const result = await Methods.bankCheckerNameValidation('nama saya, se', 'nama saya');
        t.deepEqual(result, true);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('bankCheckerNameValidation, Should return true', async (t) => {
    try {
        const result = await Methods.bankCheckerNameValidation('nama saya, se', 'prof. nama saya');
        t.deepEqual(result, true);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('bankCheckerNameValidation, Should return false if data invalid', async (t) => {
    try {
        const result = await Methods.bankCheckerNameValidation('tester wrong', 'mr.Tester is true');
        t.deepEqual(result, false);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('bankCheckerNameValidation, should return false if input length is 1 and not match', async (t) => {
    try {
        const result = await Methods.bankCheckerNameValidation('nam', 'nama saya test');
        t.deepEqual(result, false);
    } catch (err) {
        throw new Error(err.message);
    }
});

test.serial('bankCheckerNameValidation, should return true if input length is 1 and match', async (t) => {
    try {
        const result = await Methods.bankCheckerNameValidation('nama', 'nama saya test');
        t.deepEqual(result, true);
    } catch (err) {
        throw new Error(err.message);
    }
});
