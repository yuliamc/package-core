'use strict';

const axios = require('axios');
const Joi = require('joi');

const allowedEmailProvider = [
    'ses',
    'mailtrap'
];

const attachmentSchema = Joi.object().keys({
    filename: Joi.string().required(),
    path: Joi.string().required()
});

exports.email = async function (params) {
    const schema = Joi.object().keys({
        to: Joi.array().required().items(Joi.string().error(new Error('Invalid email to'))),
        from: Joi.string().email().error(new Error('Invalid email from')),
        template: Joi.string().required().min(1).error(new Error('Invalid email template')),
        subject_data: Joi.object().error(new Error('Invalid email subject data')),
        cc: Joi.array().items(Joi.string().email().error(new Error('Invalid email cc'))),
        bcc: Joi.array().items(Joi.string().email().error(new Error('Invalid email bcc'))),
        attachments: Joi.array().items(attachmentSchema).error(new Error('Invalid email attachment')),
        provider: Joi.string().valid(allowedEmailProvider).error(new Error('Invalid email provider')),
        content: Joi.object().error(new Error('Invalid email content data'))
    });
    const validParams = await Joi.validate(params, schema);
    const result = await axios.post(
        `${process.env.SERVERLESS_URL}/v1/email`,
        validParams
    ).then(response => response.data);

    return result;
};

exports.bulkEmail = async function (params) {
    const schema = Joi.object().keys({
        provider: Joi.string().valid(allowedEmailProvider).error(new Error('Invalid email provider')),
        template: Joi.string().required().min(1).error(new Error('Invalid email template')),
        targets: Joi.array().items({
            from: Joi.string().email().error(new Error('Invalid email from')),
            to: Joi.array().required().items(Joi.string().email().error(new Error('Invalid email to'))),
            cc: Joi.array().items(Joi.string().email().error(new Error('Invalid email cc'))),
            bcc: Joi.array().items(Joi.string().email().error(new Error('Invalid email bcc'))),
            subject_data: Joi.object().error(new Error('Invalid email subject param')),
            content: Joi.object().error(new Error('Invalid email content data')),
            attachments: Joi.array().items(attachmentSchema).error(new Error('Invalid email attachments'))
        })
    });
    const validParams = await Joi.validate(params, schema);
    const result = await axios.post(
        `${process.env.SERVERLESS_URL}/v1/bulk-email`,
        validParams
    ).then(response => response.data);

    return result;
};

exports.sms = function (phone, text, provider) {
    let phoneNo = phone;
    if (process.env.NODE_ENV !== 'production') {
        if (!process.env.SMSTRAP) {
            throw new Error('SMSTRAP environment variable for non production must provided!');
        }
        phoneNo = process.env.SMSTRAP;
    }

    phoneNo = phoneNo.toString();
    phoneNo = phoneNo.replace(/[^0-9]/g, '');

    return axios.post(`${process.env.SERVERLESS_URL}/v1/sms`, {
        provider,
        phone: phoneNo,
        text
    }).then(response => response.data);
};

exports.pushNotification = async function (params) {
    const accountSchema = Joi.object().keys({
        id: Joi.number().required(),
        unique_id: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required()
    }).error(new Error('Invalid Account'));
    const schema = Joi.object().keys({
        account: accountSchema,
        title: Joi.string().min(1).max(250).required().error(new Error('Invalid Title')),
        content: Joi.string().min(1).error(new Error('Invalid Content')),
        action: Joi.string().allow(null, '')
    });
    const validParams = await Joi.validate(params, schema);
    const result = await axios.post(
        `${process.env.SERVERLESS_URL}/v1/notification`,
        validParams
    ).then(response => response.data);

    return result;
};

exports.pushBulkNotification = async function (params) {
    const accountSchema = Joi.object().keys({
        id: Joi.number().required(),
        unique_id: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required()
    }).error(new Error('Invalid Account'));
    const itemSchema = Joi.object().keys({
        account: accountSchema,
        title: Joi.string().min(1).max(250).required().error(new Error('Invalid Title')),
        content: Joi.string().min(1).error(new Error('Invalid Content')),
        action: Joi.string().allow(null, '')
    });
    const schema = Joi.array().items(itemSchema);
    const validParams = await Joi.validate(params, schema);
    const result = await axios.post(
        `${process.env.SERVERLESS_URL}/v1/bulk-notification`,
        validParams
    ).then(response => response.data);

    return result;
};

exports.pivotNotification = async function (params) {
    const accountSchema = Joi.object().required().keys({
        id: Joi.number().allow(null, '', 0),
        unique_id: Joi.string().allow(null, ''),
        name: Joi.string().allow(null, ''),
        email: Joi.string().allow(null, ''),
        phone_number: Joi.string().allow(null, '')
    }).unknown(true).error(new Error('Inputan Account tidak valid'));

    const targetSchema = Joi.object().keys({
        account: accountSchema,
        reply_to: Joi.string().allow(null, ''),
        from: Joi.string().allow(null, ''),
        content: Joi.object().required().error(new Error('Inputan Content tidak valid')), // global replacer / data
        attachments: Joi.array().items(attachmentSchema).error(new Error('Inputan Attachments tidak valid')) // biasanya untuk email
    }).unknown(true).error(new Error('Inputan Target tidak valid'));

    
    const schema = Joi.object().keys({
        template_name: Joi.string().min(1).error(new Error('Inputan Nama Template tidak valid')),
        targets: Joi.array().required().items(targetSchema)
    });
    const validParams = await Joi.validate(params, schema);
    const result = await axios.post(
        `${process.env.SERVERLESS_URL}/v1/pivot-notification`,
        validParams
    ).then(response => response.data);

    return result;
};

exports.inboxNotification = async function (params) {
    const accountSchema = Joi.object().required().keys({
        id: Joi.number().required(),
        unique_id: Joi.string().required(),
        email: Joi.string().required(),
        phone_number: Joi.string().required()
    }).unknown(true).error(new Error('Inputan Account tidak valid'));
    const schema = Joi.object().keys({
        template_name: Joi.string().min(1).error(new Error('Inputan Nama Template tidak valid')),
        targets: Joi.array().required().items({
            account: accountSchema,
            content: Joi.object().required().error(new Error('Inputan Content tidak valid')), // global replacer / data
            attachments: Joi.array().items(attachmentSchema).error(new Error('Inputan Attachments tidak valid')) // biasanya untuk email
        })
    });
    const validParams = await Joi.validate(params, schema);
    const result = await axios.post(
        `${process.env.SERVERLESS_URL}/v1/inbox-notification`,
        validParams
    ).then(response => response.data);

    return result;
};

exports.emailNotification = async function (params) {
    const accountSchema = Joi.object().required().keys({
        email: Joi.string().required()
    }).unknown(true).error(new Error('Inputan Account tidak valid'));
    const schema = Joi.object().keys({
        provider: Joi.string().allow(null, '').valid(allowedEmailProvider).error(new Error('Inputan Provider tidak valid')),
        template_name: Joi.string().min(1).error(new Error('Inputan Nama Template tidak valid')),
        targets: Joi.array().required().items({
            account: accountSchema,
            content: Joi.object().required().error(new Error('Inputan Content tidak valid')), // global replacer / data
            attachments: Joi.array().items(attachmentSchema).error(new Error('Inputan Attachments tidak valid')) // biasanya untuk email
        })
    });
    const validParams = await Joi.validate(params, schema);
    const result = await axios.post(
        `${process.env.SERVERLESS_URL}/v1/email-notification`,
        validParams
    ).then(response => response.data);

    return result;
};

exports.appsNotification = async function (params) {
    const accountSchema = Joi.object().required().keys({
        id: Joi.number().required(),
        unique_id: Joi.string().required()
    }).unknown(true).error(new Error('Inputan Account tidak valid'));
    const schema = Joi.object().keys({
        template_name: Joi.string().min(1).error(new Error('Inputan Nama Template tidak valid')),
        targets: Joi.array().required().items({
            account: accountSchema,
            fcm_token: Joi.string().allow(null, '').error(new Error('Inputan Fcm Token tidak valid')),
            content: Joi.object().required().error(new Error('Inputan Content tidak valid')), // global replacer / data
            attachments: Joi.array().items(attachmentSchema).error(new Error('Inputan Attachments tidak valid')) // biasanya untuk email
        })
    });
    const validParams = await Joi.validate(params, schema);
    const result = await axios.post(
        `${process.env.SERVERLESS_URL}/v1/push-notification`,
        validParams
    ).then(response => response.data);

    return result;
};

exports.smsNotification = async function (params) {
    const accountSchema = Joi.object().required().keys({
        phone_number: Joi.string().required()
    }).unknown(true).error(new Error('Inputan Account tidak valid'));
    const schema = Joi.object().keys({
        template_name: Joi.string().min(1).error(new Error('Inputan Nama Template tidak valid')),
        targets: Joi.array().required().items({
            account: accountSchema,
            content: Joi.object().required().error(new Error('Inputan Content tidak valid')) // global replacer / data
        })
    });
    const validParams = await Joi.validate(params, schema);
    const result = await axios.post(
        `${process.env.SERVERLESS_URL}/v1/sms-notification`,
        validParams
    ).then(response => response.data);

    return result;
};

module.exports = exports;
