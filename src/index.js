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

// rules
function makeError(customError, defaultError) {
  if (!customError) return defaultError;
  if (typeof customError === "function") return customError;
  return () => customError;
}
export const required = (customError) => (f, text) => f ? null : [[text, text && (text.length || Object.getOwnPropertyNames(text).length)], v => v ? null : makeError(customError, requiredError)];
export const custom = (predicate, customError, param) => (f, text, state) => f ? null : [[text, predicate(text, state, param)], v => v ? null : makeError(customError, generalError)];
export const mustMatch = (field, fieldName, customError) => (f, text, state) => f ? null : [[text, state[field] === text], v => v ? null : makeError(customError, mustMatchError(fieldName))];
export const minLength = (length, customError) => (f, text) => f ? null : [[text, text && text.length >= length], v => v ? null : makeError(customError, minLengthError(length))];
export const maxLength = (length, customError) => (f, text) => f ? null : [[text, (!text || text && text.length <= length)], v => v ? null : makeError(customError, maxLengthError(length))];
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
export const email = (param, customError) => (f, text) => f ? emailFormater(text, param) : [emailParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const emailList = (param, customError) => (f, text) => f ? emailListFormater(text, param) : [emailListParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const hostname = (param, customError) => (f, text) => f ? hostnameFormater(text, param) : [hostnameParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const hostnameList = (param, customError) => (f, text) => f ? hostnameListFormater(text, param) : [hostnameListParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const uri = (param, customError) => (f, text) => f ? uriFormater(text, param) : [uriParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const xml = (param, customError) => (f, text) => f ? xmlFormater(text, param) : [xmlParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
email.b = () => email();
emailList.b = () => emailList();
hostname.b = () => hostname();
hostnameList.b = () => hostnameList();
uri.b = () => uri();
xml.b = () => xml();


// formats - logistics
import {
  phoneFormater, phoneParser,
  zipFormater, zipParser,
} from './formats/logistics';
export const phone = (param, customError) => (f, text) => f ? phoneFormater(text, param) : [phoneParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const zip = (param, customError) => (f, text) => f ? zipFormater(text, param) : [zipParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
phone.b = () => phone();
zip.b = () => zip();

import {
  dateFormater, dateParser,
  dateTimeFormater, dateTimeParser,
  monthAndDayFormater, monthAndDayParser,
  timeFormater, timeParser,
} from './formats/moment';
export const date = (param, customError) => (f, text) => f ? dateFormater(text, param) : [dateParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const dateTime = (param, customError) => (f, text) => f ? dateTimeFormater(text, param) : [dateTimeParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const monthAndDay = (param, customError) => (f, text) => f ? monthAndDayFormater(text, param) : [monthAndDayParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const time = (param, customError) => (f, text) => f ? timeFormater(text, param) : [timeParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
date.b = () => date();
dateTime.b = () => dateTime();
monthAndDay.b = () => monthAndDay();
time.b = () => time();

// formats - number
import {
  boolFormater, boolParser,
  decimalFormater, decimalParser,
  integerFormater, integerParser,
  realFormater, realParser,
  moneyFormater, moneyParser,
  percentFormater, percentParser,
} from './formats/number';
export const bool = (param, customError) => (f, text) => f ? boolFormater(text, param) : [boolParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const decimal = (param, customError) => (f, text) => f ? decimalFormater(text, param) : [decimalParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const integer = (param, customError) => (f, text) => f ? integerFormater(text, param) : [integerParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const real = (param, customError) => (f, text) => f ? realFormater(text, param) : [realParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const money = (param, customError) => (f, text) => f ? moneyFormater(text, param) : [moneyParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const percent = (param, customError) => (f, text) => f ? percentFormater(text, param) : [percentParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
bool.b = () => bool();
decimal.b = () => decimal();
integer.b = () => integer();
real.b = () => real();
money.b = () => money();
percent.b = () => percent();

// formats - strings
import {
  textFormater, textParser,
  memoFormater, memoParser,
  regexFormater, regexParser,
} from './formats/string';
export const text = (param, customError) => (f, text) => f ? textFormater(text, param) : [textParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const memo = (param, customError) => (f, text) => f ? memoFormater(text, param) : [memoParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
export const regex = (param, customError) => (f, text) => f ? regexFormater(text, param) : [regexParser(text, param), v => v ? null : makeError(customError, invalidFormatError)];
text.b = () => text();
memo.b = () => memo();
regex.b = () => regex();

// bindings
export { create } from './binding';
import NullBinding from './bindings/nullBinding';
import ReactBinding from './bindings/reactBinding';
export { NullBinding, ReactBinding };
