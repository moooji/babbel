'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const chaiAsPromised = require('chai-as-promised');
const babbel = require('../main');

chai.use(chaiAsPromised);

describe('Babbel - Errors', () => {

  it('should throw InvalidArgumentError if supplied API key is not a string', () => {
    expect(babbel.create)
      .to.throw(babbel.InvalidArgumentError);
  });

  it('should throw InvalidArgumentError if input is not a string or array of strings', () => {

    const translator = babbel.create(process.env.YANDEX_API_KEY);

    expect(translator.translate(123))
      .to.be.rejectedWith(babbel.InvalidArgumentError);
  });

  it('should throw InvalidArgumentError if "to" option is not 2 character language code', () => {

    const translator = babbel.create(process.env.YANDEX_API_KEY);

    return expect(translator.translate('Bonjour', {to: 'english'}))
      .to.be.rejectedWith(babbel.InvalidArgumentError);
  });

  it('should throw InvalidArgumentError if "from" option is not 2 character language code', () => {

    const translator = babbel.create(process.env.YANDEX_API_KEY);

    return expect(translator.translate('Bonjour', {from: 'english'}))
      .to.be.rejectedWith(babbel.InvalidArgumentError);
  });

  it('should throw ApiRequestError if API key is rejected', () => {

    const translator = babbel.create('invalid-api-key');

    expect(translator.translate('Something to translate'))
      .to.be.rejectedWith(babbel.ApiRequestError);
  });
});
