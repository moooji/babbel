const qs = require('qs');

function paramsSerializer(params) {
  return qs.stringify(params, { arrayFormat: 'repeat' })
};

module.exports = paramsSerializer;
