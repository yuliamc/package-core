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

const emailSchema = Joi.object().keys({
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

const schema = Joi.object().keys({
    template: Joi.string().required().valid(['lender_agreement_letter']).error(new Error('Invalid Template')),
    content: Joi.object().allow(null, {}),
    file_name: Joi.string().required().error(new Error('Invalid File')),
    email: emailSchema
});

exports.send = async function (params) {
    const validParams = await Joi.validate(params, schema);
    const result = await axios.post(
        `${process.env.SERVERLESS_URL}/v1/pdf-generator-with-email`,
        validParams
    ).then(response => response.data);

    return result;
};

module.exports = exports;
