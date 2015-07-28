"use strict";

const _ = require("lodash");
const Promise = require("bluebird");
const request = Promise.promisify(require("request"));
const createError = require("custom-error-generator");

const InvalidArgumentError = createError("InvalidArgumentError");
const ApiRequestError = createError("ApiRequestError");

const endpoint = 'https://translate.yandex.net/api/v1.5/tr.json';
const langRegExp = new RegExp("^[a-z][a-z]-[a-z][a-z]$");

function translation(apiKey) {

    if(!_.isString(apiKey)) {
        return new InvalidArgumentError("No API key provided");
    }

    /**
     * Translates a given text.
     * Returns a promise or calls callback (if provided)
     * @param {String} text
     * @param {Object} [options]
     * @param {Function} [callback]
     * @returns {Promise} [Promise]
     */
    function translate(text, options, callback) {

        return Promise.resolve(text)
            .then(function(text){

                if(!_.isString(text) && !_.isArray(text)) {
                    throw new InvalidArgumentError("Invalid text to translate (needs to be string or array)");
                }

                // Check if there are no options provided
                if(_.isFunction(options) && _.isUndefined(callback)) {

                    // Options object is actually the callback
                    callback = options;
                }

                // Ensure options
                if (!_.isPlainObject(options)) {
                    options = {};
                }

                // If no language provided, translate to English
                options.to = _.isString(options.to) ? options.to : "en";

                // Request
                return {
                    method: "GET",
                    uri: endpoint + "/translate",
                    useQuerystring: true,
                    json: true,
                    qs: {
                        text: text,
                        key: apiKey,
                        lang: options.from ? options.from + '-' + options.to : options.to
                    }
                };
            })
            .then(requestAsync)
            .then(function(res) {

                if (res.code !== 200) {
                    throw new ApiRequestError("Status code %d indicates error", response.statusCode);
                }

                // Parse the language information
                if (!_.isString(res.lang) || !langRegExp.test(res.lang)) {
                    throw new ApiRequestError("API did not return language information");
                }

                const lang = res.lang.split("-");

                return {
                    from: lang[0],
                    to: lang[1],
                    text: res.text
                }
            })
            .nodeify(callback);
    }

    function requestAsync(options) {

        return new Promise(function (resolve, reject) {

            request(options, function(err, response, body) {

                if (err) {
                    return reject(new ApiRequestError("API request failed", err));
                }

                if (response.statusCode !== 200) {
                    return reject(new ApiRequestError("Status code %d indicates error", response.statusCode));
                }

                return resolve(body);
            });
        });
    }

    return {
        translate: translate,
        InvalidArgumentError: InvalidArgumentError,
        ApiRequestError: ApiRequestError
    }
}

module.exports = translation;