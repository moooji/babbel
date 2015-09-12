'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const request = Bluebird.promisify(require('request'));

const errors = require('./errors');

const InvalidArgumentError = errors.InvalidArgumentError;
const ApiRequestError = errors.ApiRequestError;

const endpoint = 'https://translate.yandex.net/api/v1.5/tr.json';
const langRegExp = new RegExp('^[a-z][a-z]-[a-z][a-z]$');

/**
 * Constructor of translation provider
 * @param {String} apiKey
 * @constructor
 */

function Translator(apiKey) {
  this.apiKey = apiKey;
}

/**
 * Translates a provided text string
 * Returns Promise or callback (if provided)
 * @param {String|Array<String>} text
 * @param {Object|Function} [options]
 * @param {Function} [callback]
 * @returns {Promise}
 */

Translator.prototype.translate = function(text, options, callback) {

  return Bluebird.resolve(text)
    .then((text) => {

      if (!_.isString(text) && !_.isArray(text)) {
        throw new InvalidArgumentError('Invalid text to translate (needs to be string or array)');
      }

      // Check if there are no options provided
      if (_.isFunction(options) && _.isUndefined(callback)) {

        // Options object is actually the callback
        callback = options;
      }

      // Ensure options
      if (!_.isPlainObject(options)) {
        options = {};
      }

      validateOptions(options);

      // If no language provided, translate to English
      options.to = _.isString(options.to) ? options.to : 'en';

      // Request parameters
      return {
        method: 'GET',
        uri: endpoint + '/translate',
        useQuerystring: true,
        json: true,
        qs: {
          text: text,
          key: this.apiKey,
          lang: _.isString(options.from) ? options.from + '-' + options.to : options.to
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36'
        }
      };
    })
    .then(requestAsync)
    .then((res) => {

      // Parse the language information
      if (!_.isString(res.lang) || !langRegExp.test(res.lang)) {
        throw new ApiRequestError('API did not return language information');
      }

      const lang = res.lang.split('-');

      return {
        from: lang[0],
        to: lang[1],
        text: res.text
      };
    })
    .nodeify(callback);

  /**
   * Performs a web request
   * @param {Object} options
   * @returns {bluebird}
   */

  function requestAsync(options) {

    return new Bluebird((resolve, reject) => {

      request(options, (err, response, body) => {

        if (err) {
          return reject(new ApiRequestError('API request failed', err));
        }

        // Check response status code
        if (response.statusCode >= 400) {
          return reject(new ApiRequestError('Status code %d', response.statusCode));
        }

        return resolve(body);
      });
    });
  }
};

function validateOptions(options) {

  if (!options) {
    return;
  }

  if (options && !_.isPlainObject(options)) {
    throw new InvalidArgumentError('Invalid options - needs to be plain object');
  }

  if (options.to && !(_.isString(options.to) && options.to.length === 2)) {
    throw new InvalidArgumentError('Invalid "to" option - need to be 2 character language code');
  }

  if (options.from && !(_.isString(options.from) && options.from.length === 2)) {
    throw new InvalidArgumentError('Invalid "to" option - need to be 2 character language code');
  }
}

module.exports = Translator;
