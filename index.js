'use strict';

const is = require('valido');
const axios = require('axios');
const Bluebird = require('bluebird');
const createError = require('custom-error-generator');
const langRegExp = new RegExp('^[a-z][a-z]-[a-z][a-z]$');

/**
 * Factory that creates and returns
 * new translation provider
 * @param {String} apiKey
 * @returns {Babbel}
 */
function create(options) {
  return new Babbel(options);
}

/**
 * Constructor of translation provider
 * @param {String} apiKey
 * @constructor
 */
function Babbel(options) {
  if (!is.string(options.apiKey)) {
    throw new TypeError('Missing API key');
  }

  this.apiKey = options.apiKey;
  this.apiUrl = 'https://translate.yandex.net/api/v1.5/tr.json';
  this.client = options.client || axios;
  this.RequestError = createError('RequestError');
}

/**
 * Translates a provided text string
 * Returns Promise or callback (if provided)
 * @param {String|Array<String>} text - Text
 * @param {String} to - Target language code
 * @param {String} [from] - Source language code
 * @returns {Promise}
 */
Babbel.prototype.translate = function(text, to, from) {
  return Promise.resolve()
    .then(() => {
      if (!is.string(text) && !is.all.string(text)) {
        throw new TypeError('Invalid text to translate');
      }

      if (!is.string(to) || to.length !== 2) {
        throw new TypeError('"To" options is not a 2 letter language code');
      }

      if (from && (!is.string(from) || from.length !== 2)) {
        throw new TypeError('"From" options is not a 2 letter language code');
      }

      const request = {
        baseURL: this.apiUrl,
        url: '/translate',
        json: true,
        params: {
          lang: from ? `${from}-${to}` : to,
          text: text,
          key: this.apiKey,
        },
      };

      return this.client(request)
        .then(res => {
          const { lang, text } = res.data;

          if (!is.string(lang) || !langRegExp.test(lang)) {
            throw new this.RequestError('API did not return valid language information');
          }

          const langSplit = lang.split('-');

          return {
            text,
            from: langSplit[0],
            to: langSplit[1],
          };
        })
        .catch(err => {
          if (err.response) {
            throw new this.RequestError(err.message);
          } else {
            throw err;
          }
        });
    });
};

Babbel.prototype.setApiKey = function setApiKey(apiKey) {
  if (!is.string(apiKey)) {
    throw new TypeError('Invalid API key');
  }

  this.apiKey = apiKey;
}

module.exports.create = create;
