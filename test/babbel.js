'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = require('chai').expect;
const chaiAsPromised = require('chai-as-promised');
const sinonAsPromised = require('sinon-as-promised');
const babbel = require('../index');

chai.use(chaiAsPromised);

describe('Babbel - Validation', () => {
  it('should throw TypeError if supplied API key is not a string', () => {
    expect(babbel.create)
      .to.throw(TypeError);
  });

  it('should throw TypeError if input is not a string or array of strings', () => {
    const translator = babbel.create({ apiKey: '123' });

    expect(translator.translate(123, 'en'))
      .to.be.rejectedWith(TypeError);
  });

  it('should throw TypeError if "to" not 2 character language code', () => {
    const translator = babbel.create({ apiKey: '123' });

    expect(translator.translate('Bonjour', 'en'))
      .to.be.rejectedWith(TypeError);
  });

  it('should throw TypeError if "from" option is not 2 character language code', () => {
    const translator = babbel.create({ apiKey: '123' });

    expect(translator.translate('Bonjour', 'en', 123))
      .to.be.rejectedWith(TypeError);
  });
});


describe('Babbel - Translator', () => {
  it('should translate a string', () => {
    const to = 'en';
    const apiKey = '123';
    const text = 'Bonjour';

    const apiResponse = {
      lang: `fr-${to}`,
      text: ['Hello'],
    };

    const client = sinon.stub().resolves({ data: apiResponse });
    const translator = babbel.create({ apiKey, client });

    return expect(translator.translate(text, to))
      .to.eventually.be.fulfilled
      .then(res => {
        expect(client.calledWith({ 
          baseURL: translator.apiUrl,
          url: '/translate',
          json: true,
          params: {
            lang: to,
            text: text,
            key: apiKey,
          }
         }));

        expect(res).to.deep.equal({
          to,
          from: 'fr',
          text: apiResponse.text,
        });
      });
  });

  it('should translate a list of strings', () => {
    const to = 'en';
    const apiKey = '123';
    const text = ['Bonjour', 'Deux'];

    const apiResponse = {
      lang: `fr-${to}`,
      text: ['Hello', 'Two'],
    };

    const client = sinon.stub().resolves({ data: apiResponse });
    const translator = babbel.create({ apiKey, client });

    return expect(translator.translate(text, to))
      .to.eventually.be.fulfilled
      .then(res => {
        expect(client.calledWith({ 
          baseURL: translator.apiUrl,
          url: '/translate',
          json: true,
          params: {
            lang: to,
            text: text,
            key: apiKey,
          }
        }));

        expect(res).to.deep.equal({
          to,
          from: 'fr',
          text: apiResponse.text,
        });
      });
  });

  it('should translate from specified language', () => {
    const to = 'en';
    const from = 'fr';
    const apiKey = '123';
    const text = ['Bonjour', 'Deux'];

    const apiResponse = {
      lang: `${from}-${to}`,
      text: ['Hello', 'Two'],
    };

    const client = sinon.stub().resolves({ data: apiResponse });
    const translator = babbel.create({ apiKey, client });

    return expect(translator.translate(text, to, from))
      .to.eventually.be.fulfilled
      .then(res => {
        expect(client.calledWith({ 
          baseURL: translator.apiUrl,
          url: '/translate',
          json: true,
          params: {
            lang: `${from}-${to}`,
            text: text,
            key: apiKey,
          }
        }));

        expect(res).to.deep.equal({
          to,
          from,
          text: apiResponse.text,
        });
      });
  });

  it('should be rejected with RequestError if response language string is invalid', () => {
    const to = 'en';
    const from = 'fr';
    const apiKey = '123';
    const text = ['Bonjour', 'Deux'];

    const apiResponse = {
      lang: `invalid`,
      text: ['Hello', 'Two'],
    };

    const client = sinon.stub().resolves({ data: apiResponse });
    const translator = babbel.create({ apiKey, client });

    return expect(translator.translate(text, to, from))
      .to.be.rejectedWith(translator.RequestError);
  });
});
