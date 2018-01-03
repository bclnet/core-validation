// execution
export {
  rule, ruleIf
} from './execution';

// error messages
const requiredError = fieldName => `${fieldName} is required`;
const mustMatchError = otherFieldName => (fieldName) => `${fieldName} must match ${otherFieldName}`;
const minLengthError = length => (fieldName) => `${fieldName} must be at least ${length} characters`;
const maxLengthError = length => (fieldName) => `${fieldName} must be at most ${length} characters`;
const invalidFormatError = fieldName => `${fieldName} has an invalid format`;

// rules
export const required = (f, text) => f ? null : [[text, text], v => v ? null : requiredError];
export const mustMatch = (field, fieldName) => (f, text, state) => f ? null : [[text, state[field] === text], v => v ? null : mustMatchError(fieldName)];
export const minLength = (length) => (f, text) => f ? null : [[text, text && text.length >= length], v => v ? null : minLengthError(length)];
export const maxLength = (length) => (f, text) => f ? null : [[text, (!text || text && text.length <= length)], v => v ? null : maxLengthError(length)];

// formats - internet
import {
  emailFormater, emailParser,
  emailListFormater, emailListParser,
  hostnameFormater, hostnameParser,
  hostnameListFormater, hostnameListParser,
  uriFormater, uriParser,
  xmlFormater, xmlParser,
} from './formats/internet';
export const email = (param) => (f, text) => f ? emailFormater(text, param) : [emailParser(text, param), v => v ? null : invalidFormatError];
export const emailList = (param) => (f, text) => f ? emailListFormater(text, param) : [emailListParser(text, param), v => v ? null : invalidFormatError];
export const hostname = (param) => (f, text) => f ? hostnameFormater(text, param) : [hostnameParser(text, param), v => v ? null : invalidFormatError];
export const hostnameList = (param) => (f, text) => f ? hostnameListFormater(text, param) : [hostnameListParser(text, param), v => v ? null : invalidFormatError];
export const uri = (param) => (f, text) => f ? uriFormater(text, param) : [uriParser(text, param), v => v ? null : invalidFormatError];
export const xml = (param) => (f, text) => f ? xmlFormater(text, param) : [xmlParser(text, param), v => v ? null : invalidFormatError];

// formats - logistics
import {
  phoneFormater, phoneParser,
  zipFormater, zipParser,
} from './formats/logistics';
export const phone = (param) => (f, text) => f ? phoneFormater(text, param) : [phoneParser(text, param), v => v ? null : invalidFormatError];
export const zip = (param) => (f, text) => f ? zipFormater(text, param) : [zipParser(text, param), v => v ? null : invalidFormatError];

import {
  dateFormater, dateParser,
  dateTimeFormater, dateTimeParser,
  monthAndDayFormater, monthAndDayParser,
  timeFormater, timeParser,
} from './formats/moment';
export const date = (param) => (f, text) => f ? dateFormater(text, param) : [dateParser(text, param), v => v ? null : invalidFormatError];
export const dateTime = (param) => (f, text) => f ? dateTimeFormater(text, param) : [dateTimeParser(text, param), v => v ? null : invalidFormatError];
export const monthAndDay = (param) => (f, text) => f ? monthAndDayFormater(text, param) : [monthAndDayParser(text, param), v => v ? null : invalidFormatError];
export const time = (param) => (f, text) => f ? timeFormater(text, param) : [timeParser(text, param), v => v ? null : invalidFormatError];

// formats - number
import {
  boolFormater, boolParser,
  decimalFormater, decimalParser,
  integerFormater, integerParser,
  realFormater, realParser,
  moneyFormater, moneyParser,
  percentFormater, percentParser,
} from './formats/number';
export const bool = (param) => (f, text) => f ? boolFormater(text, param) : [boolParser(text, param), v => v ? null : invalidFormatError];
export const decimal = (param) => (f, text) => f ? decimalFormater(text, param) : [decimalParser(text, param), v => v ? null : invalidFormatError];
export const integer = (param) => (f, text) => f ? integerFormater(text, param) : [integerParser(text, param), v => v ? null : invalidFormatError];
export const real = (param) => (f, text) => f ? realFormater(text, param) : [realParser(text, param), v => v ? null : invalidFormatError];
export const money = (param) => (f, text) => f ? moneyFormater(text, param) : [moneyParser(text, param), v => v ? null : invalidFormatError];
export const percent = (param) => (f, text) => f ? percentFormater(text, param) : [percentParser(text, param), v => v ? null : invalidFormatError];

// formats - strings
import {
  textFormater, textParser,
  memoFormater, memoParser,
  regexFormater, regexParser,
} from './formats/string';
export const text = (param) => (f, text) => f ? textFormater(text, param) : [textParser(text, param), v => v ? null : invalidFormatError];
export const memo = (param) => (f, text) => f ? memoFormater(text, param) : [memoParser(text, param), v => v ? null : invalidFormatError];
export const regex = (param) => (f, text) => f ? regexFormater(text, param) : [regexParser(text, param), v => v ? null : invalidFormatError];

// bindings
export { create } from './binding';
import NullBinding from './bindings/nullBinding';
import ReactBinding from './bindings/reactBinding';
export { NullBinding, ReactBinding };
