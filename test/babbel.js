'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = require('chai').expect;
const chaiAsPromised = require('chai-as-promised');
const sinonAsPromised = require('sinon-as-promised');
const paramsSerializer = require('../lib/paramsSerializer');
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

  it('should throw TypeError if "target" not 2 character language code', () => {
    const translator = babbel.create({ apiKey: '123' });

    expect(translator.translate('Bonjour', 'en'))
      .to.be.rejectedWith(TypeError);
  });

  it('should throw TypeError if "source" option is not 2 character language code', () => {
    const translator = babbel.create({ apiKey: '123' });

    expect(translator.translate('Bonjour', 'en', 123))
      .to.be.rejectedWith(TypeError);
  });
});

describe('Babbel - Settings', () => {
  it('should set the API Key', () => {
    const firstApiKey = 'abc';
    const secondApiKey = 'xyz';
    const translator = babbel.create({ apiKey: firstApiKey });

    expect(translator.apiKey).to.equal(firstApiKey);

    translator.setApiKey(secondApiKey);
    expect(translator.apiKey).to.equal(secondApiKey);
  });

  it('should throw TypeError if ApiKey is invalid', () => {
    const firstApiKey = 'abc';
    const secondApiKey = 'xyz';
    const translator = babbel.create({ apiKey: firstApiKey });

    expect(translator.apiKey).to.equal(firstApiKey);
    expect(() => translator.setApiKey(123)).to.throw(TypeError);
  });
});

describe('Babbel - translator', () => {
  it('should translate a string', () => {
    const target = 'en';
    const apiKey = '123';
    const text = 'Bonjour';

    const apiResponse = {
      lang: `fr-${target}`,
      text: ['Hello'],
    };

    const client = sinon.stub().resolves({ data: apiResponse });
    const translator = babbel.create({ apiKey, client });

    return expect(translator.translate(text, target))
      .to.eventually.be.fulfilled
      .then(res => {
        expect(client.calledWith({
          paramsSerializer,
          baseURL: translator.apiUrl,
          url: '/translate',
          json: true,
          params: {
            lang: target,
            text: text,
            key: apiKey,
          }
         })).to.equal(true);

        expect(res).to.deep.equal({
          to: target,
          from: 'fr',
          text: apiResponse.text,
        });
      });
  });

  it('should translate a list of strings', () => {
    const target = 'en';
    const apiKey = '123';
    const text = ['Bonjour', 'Deux'];

    const apiResponse = {
      lang: `fr-${target}`,
      text: ['Hello', 'Two'],
    };

    const client = sinon.stub().resolves({ data: apiResponse });
    const translator = babbel.create({ apiKey, client });

    return expect(translator.translate(text, target))
      .to.eventually.be.fulfilled
      .then(res => {
        expect(client.calledWith({
          paramsSerializer,
          baseURL: translator.apiUrl,
          url: '/translate',
          json: true,
          params: {
            lang: target,
            text: text,
            key: apiKey,
          }
        })).to.equal(true);

        expect(res).to.deep.equal({
          to: target,
          from: 'fr',
          text: apiResponse.text,
        });
      });
  });

  it('should translate source specified language', () => {
    const target = 'en';
    const source = 'fr';
    const apiKey = '123';
    const text = ['Bonjour', 'Deux'];

    const apiResponse = {
      lang: `${source}-${target}`,
      text: ['Hello', 'Two'],
    };

    const client = sinon.stub().resolves({ data: apiResponse });
    const translator = babbel.create({ apiKey, client });

    return expect(translator.translate(text, target, source))
      .to.eventually.be.fulfilled
      .then(res => {
        expect(client.calledWith({
          paramsSerializer,
          baseURL: translator.apiUrl,
          url: '/translate',
          json: true,
          params: {
            lang: `${source}-${target}`,
            text: text,
            key: apiKey,
          }
        })).to.equal(true);

        expect(res).to.deep.equal({
          to: target,
          from: source,
          text: apiResponse.text,
        });
      });
  });

  it('should translate with 3 letter source language code', () => {
    const target = 'eng';
    const source = 'nno';
    const apiKey = '123';
    const text = ['Bonjour', 'Deux'];

    const apiResponse = {
      lang: `no-en`,
      text: ['Hello', 'Two'],
    };

    const client = sinon.stub().resolves({ data: apiResponse });
    const translator = babbel.create({ apiKey, client });

    return expect(translator.translate(text, target, source))
      .to.eventually.be.fulfilled
      .then(res => {
        expect(client.calledWith({
          paramsSerializer,
          baseURL: translator.apiUrl,
          url: '/translate',
          json: true,
          params: {
            lang: `no-en`,
            text: text,
            key: apiKey,
          }
        })).to.equal(true);

        expect(res).to.deep.equal({
          to: 'en',
          from: 'no',
          text: apiResponse.text,
        });
      });
  });

  it('should be rejected with RequestError if response language string is invalid', () => {
    const target = 'en';
    const source = 'fr';
    const apiKey = '123';
    const text = ['Bonjour', 'Deux'];

    const apiResponse = {
      lang: `invalid`,
      text: ['Hello', 'Two'],
    };

    const client = sinon.stub().resolves({ data: apiResponse });
    const translator = babbel.create({ apiKey, client });

    return expect(translator.translate(text, target, source))
      .to.be.rejectedWith(translator.RequestError);
  });
});
