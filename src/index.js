// execution
export {
  rule, ruleIf
} from './execution';

// error messages
const requiredError = fieldName => `${fieldName} is required`;
const generalError = fieldName => `${fieldName} is invalid`;
const mustMatchError = otherFieldName => (fieldName) => `${fieldName} must match ${otherFieldName}`;
const minLengthError = length => (fieldName) => `${fieldName} must be at least ${length} characters`;
const maxLengthError = length => (fieldName) => `${fieldName} must be at most ${length} characters`;
const invalidFormatError = fieldName => `${fieldName} has an invalid format`;

function makeSymbols(...symbols) {
  for (var i in symbols) {
    let symbol = symbols[i];
    symbol.b = () => symbol();
    symbol.parse = (text, defaultValue) => { let v = symbol()(text).parse(); return v[1] ? v[0] : defaultValue; }
    symbol.parseInfo = (text) => symbol()(text).parse();
    symbol.format = (text) => symbol()(text).format();
  }
}

function funcSymbol(name, symbol) {
  symbol.n = name;
  symbol.parse = (text, defaultValue) => { let v = symbol(text).parse(); return v[1] ? v[0] : defaultValue; }
  symbol.parseInfo = (text) => symbol(text).parse();
  symbol.format = (text) => symbol(text).format();
  return symbol;
}

// options
var globals = {};
export function setGlobals(name, param) {
  globals[name] = param;
}
function funcParm(name, param) {
  return Object.assign(globals[name] || {}, param);
}

// rules
function makeError(customError, defaultError) {
  if (!customError) return defaultError;
  if (typeof customError === "function") return customError;
  return () => customError;
}
export const required = (customError) => funcSymbol('required', function required(text) { return { format: () => undefined, parse: () => [text, text && (text.length || Object.keys(text).length), v => v ? null : makeError(customError, requiredError)] } });
export const custom = (predicate, customError, param) => funcSymbol('custom', function custom(text, state) { return { format: () => undefined, parse: () => [text, predicate(text, state, param), v => v ? null : makeError(customError, generalError)] } });
export const mustMatch = (field, fieldName, customError) => funcSymbol('mustMatch', function mustMatch(text, state) { return { format: () => undefined, parse: () => [text, state[field] === text, v => v ? null : makeError(customError, mustMatchError(fieldName))] } });
export const minLength = (length, customError) => funcSymbol('minLength', function minLength(text) { return { format: () => undefined, parse: () => [text, text && text.length >= length, v => v ? null : makeError(customError, minLengthError(length))] } });
export const maxLength = (length, customError) => funcSymbol('maxLength', function maxLength(text) { return { format: () => undefined, parse: () => [text, (!text || text && text.length <= length), v => v ? null : makeError(customError, maxLengthError(length))] } });
makeSymbols(required);
custom.b = () => { console.log('rule: custom must be a function') };
mustMatch.b = () => { console.log('rule: mustMatch must be a function') };
minLength.b = () => { console.log('rule: minLength must be a function') };
maxLength.b = () => { console.log('rule: maxLength must be a function') };

// formats - internet
import {
  emailFormater, emailParser,
  emailListFormater, emailListParser,
  hostnameFormater, hostnameParser,
  hostnameListFormater, hostnameListParser,
  uriFormater, uriParser,
  xmlFormater, xmlParser,
} from './formats/internet';
export const email = (param, customError) => funcSymbol('email', function email(text) { return { format: () => emailFormater(text, funcParm('email', param)), parse: () => emailParser(text, funcParm('email', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const emailList = (param, customError) => funcSymbol('emailList', function emailList(text) { return { format: () => emailListFormater(text, funcParm('emailList', param)), parse: () => emailListParser(text, funcParm('emailList', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const hostname = (param, customError) => funcSymbol('hostname', function hostname(text) { return { format: () => hostnameFormater(text, funcParm('hostname', param)), parse: () => hostnameParser(text, funcParm('hostname', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const hostnameList = (param, customError) => funcSymbol('hostnameList', function hostnameList(text) { return { format: () => hostnameListFormater(text, funcParm('hostnameList', param)), parse: () => hostnameListParser(text, funcParm('hostnameList', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const uri = (param, customError) => funcSymbol('uri', function uri(text) { return { format: () => uriFormater(text, funcParm('uri', param)), parse: () => uriParser(text, funcParm('uri', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const xml = (param, customError) => funcSymbol('xml', function xml(text) { return { format: () => xmlFormater(text, funcParm('xml', param)), parse: () => xmlParser(text, funcParm('xml', param), v => v ? null : makeError(customError, invalidFormatError)) } });
makeSymbols(email, emailList, hostname, hostnameList, uri, xml);

// formats - logistics
import {
  phoneFormater, phoneParser,
  zipFormater, zipParser,
} from './formats/logistics';
export const phone = (param, customError) => funcSymbol('phone', function phone(text) { return { format: () => phoneFormater(text, funcParm('phone', param)), parse: () => phoneParser(text, funcParm('phone', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const zip = (param, customError) => funcSymbol('zip', function zip(text) { return { format: () => zipFormater(text, funcParm('zip', param)), parse: () => zipParser(text, funcParm('zip', param), v => v ? null : makeError(customError, invalidFormatError)) } });
makeSymbols(phone, zip);

import {
  dateFormater, dateParser,
  dateTimeFormater, dateTimeParser,
  monthAndDayFormater, monthAndDayParser,
  timeFormater, timeParser,
} from './formats/moment';
export const date = (param, customError) => funcSymbol('date', function date(text) { return { format: () => dateFormater(text, funcParm('date', param)), parse: () => dateParser(text, funcParm('date', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const dateTime = (param, customError) => funcSymbol('dateTime', function dateTime(text) { return { format: () => dateTimeFormater(text, funcParm('dateTime', param)), parse: () => dateTimeParser(text, funcParm('dateTime', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const monthAndDay = (param, customError) => funcSymbol('monthAndDay', function monthAndDay(text) { return { format: () => monthAndDayFormater(text, funcParm('monthAndDay', param)), parse: () => monthAndDayParser(text, funcParm('monthAndDay', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const time = (param, customError) => funcSymbol('time', function time(text) { return { format: () => timeFormater(text, funcParm('time', param)), parse: () => timeParser(text, funcParm('time', param), v => v ? null : makeError(customError, invalidFormatError)) } });
makeSymbols(date, dateTime, monthAndDay, time);

// formats - number
import {
  boolFormater, boolParser,
  decimalFormater, decimalParser,
  integerFormater, integerParser,
  realFormater, realParser,
  moneyFormater, moneyParser,
  percentFormater, percentParser,
} from './formats/number';
export const bool = (param, customError) => funcSymbol('bool', function bool(text) { return { format: () => boolFormater(text, funcParm('bool', param)), parse: () => boolParser(text, funcParm('bool', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const decimal = (param, customError) => funcSymbol('decimal', function decimal(text) { return { format: () => decimalFormater(text, funcParm('decimal', param)), parse: () => decimalParser(text, funcParm('decimal', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const integer = (param, customError) => funcSymbol('integer', function integer(text) { return { format: () => integerFormater(text, funcParm('integer', param)), parse: () => integerParser(text, funcParm('integer', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const real = (param, customError) => funcSymbol('real', function real(text) { return { format: () => realFormater(text, funcParm('real', param)), parse: () => realParser(text, funcParm('real', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const money = (param, customError) => funcSymbol('money', function money(text) { return { format: () => moneyFormater(text, funcParm('money', param)), parse: () => moneyParser(text, funcParm('money', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const percent = (param, customError) => funcSymbol('percent', function percent(text) { return { format: () => percentFormater(text, funcParm('percent', param)), parse: () => percentParser(text, funcParm('percent', param), v => v ? null : makeError(customError, invalidFormatError)) } });
makeSymbols(bool, decimal, integer, real, money, percent);

// formats - strings
import {
  textFormater, textParser,
  memoFormater, memoParser,
  regexFormater, regexParser,
} from './formats/string';
export const text = (param, customError) => funcSymbol('text', function text(text) { return { format: () => textFormater(text, funcParm('text', param)), parse: () => textParser(text, funcParm('text', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const memo = (param, customError) => funcSymbol('memo', function memo(text) { return { format: () => memoFormater(text, funcParm('memo', param)), parse: () => memoParser(text, funcParm('memo', param), v => v ? null : makeError(customError, invalidFormatError)) } });
export const regex = (param, customError) => funcSymbol('regex', function regex(text) { return { format: () => regexFormater(text, funcParm('regex', param)), parse: () => regexParser(text, funcParm('regex', param), v => v ? null : makeError(customError, invalidFormatError)) } });
makeSymbols(text, memo, regex);

// bindings
export { create } from './binding';
import NullBinding from './bindings/nullBinding';
import ReactBinding from './bindings/reactBinding';
export { NullBinding, ReactBinding };
