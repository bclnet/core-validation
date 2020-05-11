/* istanbul ignore file */
// execution
import { params as globals_params } from './globals';
export {
  rule, ruleIf, find, flatten
} from './execution';

function makeSymbols(...symbols) {
  for (let i in symbols) {
    const symbol = symbols[i];
    symbol.b = () => symbol();
    symbol.parse = (text, defaultValue) => { let v = symbol()(text).parse(); return v[1] ? v[0] : defaultValue; }
    symbol.parseInfo = (text) => symbol()(text).parse();
    symbol.format = (text) => symbol()(text).format();
  }
}

function makeSymbol(name, symbol) {
  symbol.n = name;
  symbol.parse = (text, defaultValue) => { let v = symbol(text).parse(); return v[1] ? v[0] : defaultValue; }
  symbol.parseInfo = (text) => symbol(text).parse();
  symbol.format = (text) => symbol(text).format();
  return symbol;
}

function makeParm(name, param) {
  return Object.assign(globals_params[name] || {}, param);
}

function makeError(customError, defaultError) {
  if (!customError) return defaultError;
  if (typeof customError === "function") return customError;
  return () => customError;
}

// options
export const setParam = (name, param) => globals_params[name] = param;
const nulParser = (text, parsed, error) => [text, parsed, error];

// error messages
const requiredError = (fieldName) => `${fieldName} is required`;
const generalError = (fieldName) => `${fieldName} is invalid`;
const invalidFormatError = (fieldName) => `${fieldName} has an invalid format`;
const mustMatchError = (otherFieldName) => (fieldName) => `${fieldName} must match ${otherFieldName}`;
const minLengthError = (length) => (fieldName) => `${fieldName} must be at least ${length} characters`;
const maxLengthError = (length) => (fieldName) => `${fieldName} must be at most ${length} characters`;

// rules
export const required = (customError) => makeSymbol('required', function required(text) { return { format: () => undefined, parse: () => nulParser(text, text && (text.length || Object.keys(text).length), () => makeError(customError, requiredError)) } });
export const custom = (predicate, customError, param) => makeSymbol('custom', function custom(text, state) { return { format: () => undefined, parse: () => nulParser(text, predicate(text, state, param), () => makeError(customError, generalError)) } });
export const mustMatch = (field, fieldName, customError) => makeSymbol('mustMatch', function mustMatch(text, state) { return { format: () => undefined, parse: () => nulParser(text, state[field] === text, () => makeError(customError, mustMatchError(fieldName))) } });
export const minLength = (length, customError) => makeSymbol('minLength', function minLength(text) { return { format: () => undefined, parse: () => nulParser(text, text && text.length >= length, () => makeError(customError, minLengthError(length))) } });
export const maxLength = (length, customError) => makeSymbol('maxLength', function maxLength(text) { return { format: () => undefined, parse: () => nulParser(text, (!text || text.length <= length), () => makeError(customError, maxLengthError(length))) } });
makeSymbols(required);
custom.b = () => { console.log('rule: custom must be a function') };
mustMatch.b = () => { console.log('rule: mustMatch must be a function') };
minLength.b = () => { console.log('rule: minLength must be a function') };
maxLength.b = () => { console.log('rule: maxLength must be a function') };

// formats - internet
import {
  emailFormatter, emailParser,
  emailListFormatter, emailListParser,
  hostnameFormatter, hostnameParser,
  hostnameListFormatter, hostnameListParser,
  uriFormatter, uriParser,
  xmlFormatter, xmlParser,
} from './formats/internet';
export const email = (param, customError) => makeSymbol('email', function email(text) { return { format: () => emailFormatter(text, makeParm('email', param)), parse: () => emailParser(text, makeParm('email', param), () => makeError(customError, invalidFormatError)) } });
export const emailList = (param, customError) => makeSymbol('emailList', function emailList(text) { return { format: () => emailListFormatter(text, makeParm('emailList', param)), parse: () => emailListParser(text, makeParm('emailList', param), () => makeError(customError, invalidFormatError)) } });
export const hostname = (param, customError) => makeSymbol('hostname', function hostname(text) { return { format: () => hostnameFormatter(text, makeParm('hostname', param)), parse: () => hostnameParser(text, makeParm('hostname', param), () => makeError(customError, invalidFormatError)) } });
export const hostnameList = (param, customError) => makeSymbol('hostnameList', function hostnameList(text) { return { format: () => hostnameListFormatter(text, makeParm('hostnameList', param)), parse: () => hostnameListParser(text, makeParm('hostnameList', param), () => makeError(customError, invalidFormatError)) } });
export const uri = (param, customError) => makeSymbol('uri', function uri(text) { return { format: () => uriFormatter(text, makeParm('uri', param)), parse: () => uriParser(text, makeParm('uri', param), () => makeError(customError, invalidFormatError)) } });
export const xml = (param, customError) => makeSymbol('xml', function xml(text) { return { format: () => xmlFormatter(text, makeParm('xml', param)), parse: () => xmlParser(text, makeParm('xml', param), () => makeError(customError, invalidFormatError)) } });
makeSymbols(email, emailList, hostname, hostnameList, uri, xml);

// formats - logistics
import {
  phoneFormatter, phoneParser,
  zipFormatter, zipParser,
} from './formats/logistics';
export const phone = (param, customError) => makeSymbol('phone', function phone(text) { return { format: () => phoneFormatter(text, makeParm('phone', param)), parse: () => phoneParser(text, makeParm('phone', param), () => makeError(customError, invalidFormatError)) } });
export const zip = (param, customError) => makeSymbol('zip', function zip(text) { return { format: () => zipFormatter(text, makeParm('zip', param)), parse: () => zipParser(text, makeParm('zip', param), () => makeError(customError, invalidFormatError)) } });
makeSymbols(phone, zip);

// formats - moment
import {
  dateFormatter, dateParser,
  dateTimeFormatter, dateTimeParser,
  monthAndDayFormatter, monthAndDayParser,
  timeFormatter, timeParser,
} from './formats/moment';
export const date = (param, customError) => makeSymbol('date', function date(text) { return { format: () => dateFormatter(text, makeParm('date', param)), parse: () => dateParser(text, makeParm('date', param), () => makeError(customError, invalidFormatError)) } });
export const dateTime = (param, customError) => makeSymbol('dateTime', function dateTime(text) { return { format: () => dateTimeFormatter(text, makeParm('dateTime', param)), parse: () => dateTimeParser(text, makeParm('dateTime', param), () => makeError(customError, invalidFormatError)) } });
export const monthAndDay = (param, customError) => makeSymbol('monthAndDay', function monthAndDay(text) { return { format: () => monthAndDayFormatter(text, makeParm('monthAndDay', param)), parse: () => monthAndDayParser(text, makeParm('monthAndDay', param), () => makeError(customError, invalidFormatError)) } });
export const time = (param, customError) => makeSymbol('time', function time(text) { return { format: () => timeFormatter(text, makeParm('time', param)), parse: () => timeParser(text, makeParm('time', param), () => makeError(customError, invalidFormatError)) } });
makeSymbols(date, dateTime, monthAndDay, time);

// formats - number
import {
  boolFormatter, boolParser,
  decimalFormatter, decimalParser,
  integerFormatter, integerParser,
  realFormatter, realParser,
  moneyFormatter, moneyParser,
  percentFormatter, percentParser,
} from './formats/number';
export const bool = (param, customError) => makeSymbol('bool', function bool(text) { return { format: () => boolFormatter(text, makeParm('bool', param)), parse: () => boolParser(text, makeParm('bool', param), () => makeError(customError, invalidFormatError)) } });
export const decimal = (param, customError) => makeSymbol('decimal', function decimal(text) { return { format: () => decimalFormatter(text, makeParm('decimal', param)), parse: () => decimalParser(text, makeParm('decimal', param), () => makeError(customError, invalidFormatError)) } });
export const integer = (param, customError) => makeSymbol('integer', function integer(text) { return { format: () => integerFormatter(text, makeParm('integer', param)), parse: () => integerParser(text, makeParm('integer', param), () => makeError(customError, invalidFormatError)) } });
export const real = (param, customError) => makeSymbol('real', function real(text) { return { format: () => realFormatter(text, makeParm('real', param)), parse: () => realParser(text, makeParm('real', param), () => makeError(customError, invalidFormatError)) } });
export const money = (param, customError) => makeSymbol('money', function money(text) { return { format: () => moneyFormatter(text, makeParm('money', param)), parse: () => moneyParser(text, makeParm('money', param), () => makeError(customError, invalidFormatError)) } });
export const percent = (param, customError) => makeSymbol('percent', function percent(text) { return { format: () => percentFormatter(text, makeParm('percent', param)), parse: () => percentParser(text, makeParm('percent', param), () => makeError(customError, invalidFormatError)) } });
makeSymbols(bool, decimal, integer, real, money, percent);

// formats - strings
import {
  textFormatter, textParser,
  memoFormatter, memoParser,
  regexFormatter, regexParser,
} from './formats/string';
export const text = (param, customError) => makeSymbol('text', function text(text) { return { format: () => textFormatter(text, makeParm('text', param)), parse: () => textParser(text, makeParm('text', param), () => makeError(customError, invalidFormatError)) } });
export const memo = (param, customError) => makeSymbol('memo', function memo(text) { return { format: () => memoFormatter(text, makeParm('memo', param)), parse: () => memoParser(text, makeParm('memo', param), () => makeError(customError, invalidFormatError)) } });
export const regex = (param, customError) => makeSymbol('regex', function regex(text) { return { format: () => regexFormatter(text, makeParm('regex', param)), parse: () => regexParser(text, makeParm('regex', param), () => makeError(customError, invalidFormatError)) } });
makeSymbols(text, memo, regex);

// bindings
import NullBinding from './bindings/nullBinding';
import ReactBinding from './bindings/reactBinding';
export { NullBinding, ReactBinding };

// validator - default
export { create } from './validator';
let binding, binder;
try {
  require('react');
  binding = new exports.ReactBinding();
  binder = require('./React/Binder').Binder;
}
catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') throw e;
  binding = new exports.NullBinding();
  binder = null;
}
const V = exports.create(binding);
for (let key in exports) {
  if (!exports.hasOwnProperty(key)) continue;
  V[key] = exports[key];
}
V.Binder = binder
export default V;