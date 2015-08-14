"use strict";

const _ = require("lodash");

const errors = require("./lib/errors");
const TranslationProvider = require("./lib/translationProvider");

const InvalidArgumentError = errors.InvalidArgumentError;
const ApiRequestError = errors.ApiRequestError;

/**
 * Factory that creates and returns
 * new translation provider
 * @param options
 * @returns {TranslationProvider}
 */
function factory(options) {

    if(!_.isString(options.apiKey)) {
        return new InvalidArgumentError("No API key provided");
    }

    const apiKey = options.apiKey;

    return new TranslationProvider(apiKey);
}

module.exports.create = factory;
module.exports.InvalidArgumentError = InvalidArgumentError;
module.exports.ApiRequestError = ApiRequestError;