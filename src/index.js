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

function funcSymbol(symbol) {
  symbol.parse = (text, defaultValue) => { let v = symbol(text).parse(); return v[1] ? v[0] : defaultValue; }
  symbol.parseInfo = (text) => symbol(text).parse();
  symbol.format = (text) => symbol(text).format();
  return symbol;
}

// rules
function makeError(customError, defaultError) {
  if (!customError) return defaultError;
  if (typeof customError === "function") return customError;
  return () => customError;
}
export const required = (customError) => function required(text) { return { format: () => null, parse: () => [text, text && (text.length || Object.keys(text).length), v => v ? null : makeError(customError, requiredError)] } }
export const custom = (predicate, customError, param) => function custom(text, state) { return { format: () => null, parse: () => [text, predicate(text, state, param), v => v ? null : makeError(customError, generalError)] } }
export const mustMatch = (field, fieldName, customError) => function mustMatch(text, state) { return { format: () => null, parse: () => [text, state[field] === text, v => v ? null : makeError(customError, mustMatchError(fieldName))] } }
export const minLength = (length, customError) => function minLength(text) { return { format: () => null, parse: () => [text, text && text.length >= length, v => v ? null : makeError(customError, minLengthError(length))] } }
export const maxLength = (length, customError) => function maxLength(text) { return { format: () => null, parse: () => [text, (!text || text && text.length <= length), v => v ? null : makeError(customError, maxLengthError(length))] } }
required.b = () => required();
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
export const email = (param, customError) => funcSymbol(function email(text) { return { format: () => emailFormater(text, param), parse: () => emailParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const emailList = (param, customError) => funcSymbol(function emailList(text) { return { format: () => emailListFormater(text, param), parse: () => emailListParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const hostname = (param, customError) => funcSymbol(function hostname(text) { return { format: () => hostnameFormater(text, param), parse: () => hostnameParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const hostnameList = (param, customError) => funcSymbol(function hostnameList(text) { return { format: () => hostnameListFormater(text, param), parse: () => hostnameListParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const uri = (param, customError) => funcSymbol(function uri(text) { return { format: () => uriFormater(text, param), parse: () => uriParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const xml = (param, customError) => funcSymbol(function xml(text) { return { format: () => xmlFormater(text, param), parse: () => xmlParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
makeSymbols(email, emailList, hostname, hostnameList, uri, xml);

// formats - logistics
import {
  phoneFormater, phoneParser,
  zipFormater, zipParser,
} from './formats/logistics';
export const phone = (param, customError) => funcSymbol(function phone(text) { return { format: () => phoneFormater(text, param), parse: () => phoneParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const zip = (param, customError) => funcSymbol(function zip(text) { return { format: () => zipFormater(text, param), parse: () => zipParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
makeSymbols(phone, zip);

import {
  dateFormater, dateParser,
  dateTimeFormater, dateTimeParser,
  monthAndDayFormater, monthAndDayParser,
  timeFormater, timeParser,
} from './formats/moment';
export const date = (param, customError) => funcSymbol(function date(text) { return { format: () => dateFormater(text, param), parse: () => dateParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const dateTime = (param, customError) => funcSymbol(function dateTime(text) { return { format: () => dateTimeFormater(text, param), parse: () => dateTimeParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const monthAndDay = (param, customError) => funcSymbol(function monthAndDay(text) { return { format: () => monthAndDayFormater(text, param), parse: () => monthAndDayParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const time = (param, customError) => funcSymbol(function time(text) { return { format: () => timeFormater(text, param), parse: () => timeParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
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
export const bool = (param, customError) => funcSymbol(function bool(text) { return { format: () => boolFormater(text, param), parse: () => boolParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const decimal = (param, customError) => funcSymbol(function decimal(text) { return { format: () => decimalFormater(text, param), parse: () => decimalParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const integer = (param, customError) => funcSymbol(function integer(text) { return { format: () => integerFormater(text, param), parse: () => integerParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const real = (param, customError) => funcSymbol(function real(text) { return { format: () => realFormater(text, param), parse: () => realParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const money = (param, customError) => funcSymbol(function money(text) { return { format: () => moneyFormater(text, param), parse: () => moneyParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const percent = (param, customError) => funcSymbol(function percent(text) { return { format: () => percentFormater(text, param), parse: () => percentParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
makeSymbols(bool, decimal, integer, real, money, percent);

// formats - strings
import {
  textFormater, textParser,
  memoFormater, memoParser,
  regexFormater, regexParser,
} from './formats/string';
export const text = (param, customError) => funcSymbol(function text(text) { return { format: () => textFormater(text, param), parse: () => textParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const memo = (param, customError) => funcSymbol(function memo(text) { return { format: () => memoFormater(text, param), parse: () => memoParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
export const regex = (param, customError) => funcSymbol(function regex(text) { return { format: () => regexFormater(text, param), parse: () => regexParser(text, param, v => v ? null : makeError(customError, invalidFormatError)) } });
makeSymbols(text, memo, regex);

// bindings
export { create } from './binding';
import NullBinding from './bindings/nullBinding';
import ReactBinding from './bindings/reactBinding';
export { NullBinding, ReactBinding };
