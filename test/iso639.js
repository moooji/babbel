'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const iso639 = require('../lib/iso639');

describe('ISO 639', () => {
  it('should throw TypeError if supplied language code is invalid', () => {
    expect(() => iso639.ensurePart1('sees'))
      .to.throw(TypeError);
  });

  it('should throw LanguageError if 2 letter language cannot be resolve', () => {
    expect(() => iso639.ensurePart1('12'))
      .to.throw(iso639.LanguageError);
  });

  it('should throw LanguageError if 3 letter language cannot be resolve', () => {
    expect(() => iso639.ensurePart1('123'))
      .to.throw(iso639.LanguageError);
  });

  it('should return ISO 639-1 code for 2 letter code', () => {
    expect(iso639.ensurePart1('nn'))
      .to.equal('nn');
  });

  it('should resolve macro language for 2 letter code', () => {
    expect(iso639.ensurePart1('nn', true))
      .to.equal('no');
  });

  it('should resolve language for non-macro 2 letter code', () => {
    expect(iso639.ensurePart1('en', true))
      .to.equal('en');
  });

  it('should return ISO 639-1 code for 3 letter code', () => {
    expect(iso639.ensurePart1('nno'))
      .to.equal('nn');
  });

  it('should resolve macro language for 3 letter code', () => {
    expect(iso639.ensurePart1('nno', true))
      .to.equal('no');
  });

  it('should resolve language for non-macro 3 letter code', () => {
    expect(iso639.ensurePart1('eng', true))
      .to.equal('en');
  });
});