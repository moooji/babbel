'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const chaiAsPromised = require('chai-as-promised');
const babbel = require('../main');

chai.use(chaiAsPromised);

describe('Babbel - Translator', () => {

  it('should translate a string', () => {

    const translator = babbel.create(process.env.YANDEX_API_KEY);

    expect(translator.translate('Bonjour'))
      .to.eventually.be.fulfilled
      .then((res) => {

        expect(res).to.deep.equal({
          from: 'fr',
          to: 'en',
          text: ['Hello']
        });
      });
  });

  it('should translate an array of strings', () => {

    const translator = babbel.create(process.env.YANDEX_API_KEY);

    return expect(translator.translate(['Bonjour', 'Maison']))
      .to.eventually.be.fulfilled
      .then((res) => {

        return expect(res).to.deep.equal({
          from: 'fr',
          to: 'en',
          text: ['Hello', 'Home']
        });
      });
  });

  it('should translate to specified language', () => {

    const translator = babbel.create(process.env.YANDEX_API_KEY);

    return expect(translator.translate(['Bonjour', 'Maison'], {to: 'de'}))
      .to.eventually.be.fulfilled
      .then((res) => {

        return expect(res).to.deep.equal({
          from: 'fr',
          to: 'de',
          text: ['Hallo', 'Haus']
        });
      });
  });

  it('should translate from specified language', () => {

    const translator = babbel.create(process.env.YANDEX_API_KEY);

    return expect(translator.translate(['Bonjour', 'Maison'], {from: 'de'}))
      .to.eventually.be.fulfilled
      .then((res) => {
        return expect(res.from).to.equal('de');
      });
  });
});
