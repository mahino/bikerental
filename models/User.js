const mysql = require('mysql');
const Joi = require('joi');

module.exports = Joi.object().keys({
    email: Joi.string().required(),
    username: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    groupid: Joi.required()
});