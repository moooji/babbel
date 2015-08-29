"use strict";

const http = require("http");
const _ = require("lodash");
const Promise = require("bluebird");
const request = Promise.promisify(require("request"));

const errors = require("./errors");

const InvalidArgumentError = errors.InvalidArgumentError;
const ApiRequestError = errors.ApiRequestError;

const connectionPool = new http.Agent();
connectionPool.maxSockets = 50;

const endpoint = 'https://translate.yandex.net/api/v1.5/tr.json';
const langRegExp = new RegExp("^[a-z][a-z]-[a-z][a-z]$");

/**
 * Constructor of translation provider
 * @param {String} apiKey
 * @contructor
 */
function TranslationProvider(apiKey) {
    this._apiKey = apiKey;
}

TranslationProvider.prototype = {
    translate: translate
};

/**
 * Translates a provided text string
 * Returns Promise or callback (if provided)
 * @param {String|[String]} text
 * @param {Object|Function} [options]
 * @param {Function} [callback]
 * @returns {Promise}
 */
function translate(text, options, callback) {

    const apiKey = this._apiKey;

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
                    lang: _.isString(options.from) ? options.from + '-' + options.to : options.to
                },
                pool: connectionPool,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36'
                }
            };
        })
        .then(requestAsync)
        .then(function(res) {

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

    /**
     * Performs a web request
     * @param options
     * @returns {bluebird}
     */
    function requestAsync(options) {

        return new Promise(function (resolve, reject) {

            request(options, function(err, response, body) {

                if (err) {
                    return reject(new ApiRequestError("API request failed", err));
                }

                // Check response status code
                if (response.statusCode >= 400) {
                    return reject(new ApiRequestError("Status code %d indicates error", response.statusCode));
                }

                return resolve(body);
            });
        });
    }
}

module.exports = TranslationProvider;