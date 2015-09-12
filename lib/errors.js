'use strict';

const createError = require('custom-error-generator');

const InvalidArgumentError = createError('InvalidArgumentError');
const ApiRequestError = createError('ApiRequestError');

module.exports.InvalidArgumentError = InvalidArgumentError;
module.exports.ApiRequestError = ApiRequestError;
