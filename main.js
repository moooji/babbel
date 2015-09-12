'use strict';

const _ = require('lodash');
const errors = require('./lib/errors');
const Translator = require('./lib/translator');

const InvalidArgumentError = errors.InvalidArgumentError;
const ApiRequestError = errors.ApiRequestError;

/**
 * Factory that creates and returns
 * new translation provider
 * @param {String} apiKey
 * @returns {Translator}
 */

function create(apiKey) {

  if (!_.isString(apiKey)) {
    throw new InvalidArgumentError('Missing API key');
  }

  return new Translator(apiKey);
}

module.exports.create = create;
module.exports.InvalidArgumentError = InvalidArgumentError;
module.exports.ApiRequestError = ApiRequestError;
