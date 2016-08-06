const is = require('valido');
const map = require('./map');
const macroMap = require('./macroMap.json');
const createError = require('custom-error-generator');

const LanguageError = createError('LanguageError');

function ensurePart1(code, resolveMacroCode) {
  if (!is.string(code) || code.length < 2 || code.length > 3) {
    throw new TypeError('Invalid language code');
  }

  let result = null;
  const isPart1 = code.length === 2;
  const codeOrMacroCode = resolveMacroCode ? ensureMacroCode(code) : code;

  if (isPart1) {
    result = map.part1[codeOrMacroCode] ? codeOrMacroCode : null;
  } else {
    result = map.part2T[codeOrMacroCode];
  }
  
  if (!result) {
    throw new LanguageError('Cannot resolve language code');
  }

  return result;
}

/**
 * Convert to macro language if it exists,
 * otherwise return original code
 * nno->nor, nn->no, eng->en
 */
function ensureMacroCode(code) {
  if (!is.string(code) || code.length < 2 || code.length > 3) {
    throw new TypeError('Invalid language code');
  }

  const isPart1 = code.length === 2;
  const macroCode = isPart1 ? macroMap.part1[code] : macroMap.part2T[code];
  return macroCode || code;
}

module.exports.ensurePart1 = ensurePart1;
module.exports.LanguageError = LanguageError;
