import moment from 'moment';

const _minDateValue = moment([1753, 1, 1]);
const _maxDateValue = moment([9999, 12, 31]);

// date
let dateFormaterDefault = 'YYYY-MM-DD'; //'M/D/YYYY'
export const dateFormater = (value, param) => {
  if (!value) return '';
  value = moment(value);
  if (param) {
    switch (param.format) {
      case 'date': return value.format('DD MMMM YYYY');
      case 'longDate': return value.format('dddd, MMMM D, YYYY');
      case 'longDate2': return value.format(value.year() === moment().year() ? 'dddd, MMMM D' : 'dddd, MMMM D, YYYY');
      case 'shortDate': return value.format('D-MMM-YYYY');
      case 'shorterDate': return value.format('MMM D YYYY');
      case 'monthDay': return value.format('MMMM D');
      case 'monthYear': return value.format('MMMM YYYY');
      case 'pattern': return value.format(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.format(dateFormaterDefault);
};
export const dateParser = (text, param) => {
  if (!text) return [text, false];
  let value = moment(text); if (!value.isValid()) return [text, false];
  else if (value < _minDateValue || value > _maxDateValue) return [value, false];
  value = moment([value.year(), value.month(), value.date()]);
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < moment(minValue)) return [value, false];
    let maxValue = param.maxValue; if (maxValue && value > moment(maxValue)) return [value, false];
  }
  return [value, true];
};

// dateTime
export const dateTimeFormater = (value, param) => {
  if (!value) return '';
  value = moment(value);
  if (param) {
    switch (param.format) {
      case 'date': return value.format('DD MMMM YYYY hh:mm tt');
      case 'longDateTime': return value.format('dddd, MMMM D, YYYY');
      case 'longDate': return value.format('dddd, MMMM D, YYYY');
      case 'longTime': return value.format('hh:mm:ss tt');
      case 'shortDate': return value.format('D-MMM-YYYY');
      case 'shortTime': return value.format('hh:mm tt');
      case 'tinyDate': return value.format('M/D/YY');
      case 'tinyDateTime': return value.format('M/D/YY hh:mm tt');
      case 'pattern': return value.format(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.format('M/D/YYYY');
};
export const dateTimeParser = (text, param) => {
  if (!text) return [text, false];
  let value = moment(text); if (!value.isValid()) return [text, false];
  else if (value < _minDateValue || value > _maxDateValue) return [value, false];
  value = moment([value.year(), value.month() + 1, value.date()]);
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < moment(minValue)) return [value, false];
    let maxValue = param.maxValue; if (maxValue && value > moment(maxValue)) return [value, false];
  }
  return [value, true];
};

// monthAndDay
export const monthAndDayFormater = (value, param) => {
  if (!value) return '';
  value = moment(value);
  if (param) {
    switch (param.format) {
      case 'pattern': return value.format(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.format('M/D');
};
export const monthAndDayParser = (text, param) => {
  if (!text) return [text, false];
  let match = /^\d{1,2}([/\-])\d{1,2}$/.exec(text); if (!match) return [text, false];
  let value = moment(match[1] + '2000'); if (!value.isValid()) return [text, false];
  return [value, true];
};

// time
export const timeFormater = (value, param) => {
  if (!value) return '';
  value = moment(value);
  if (param) {
    switch (param.format) {
      case 'longTime': return value.format('hh:mm:ss tt');
      case 'shortTime': return value.format('hh:mm tt');
      case 'pattern': return value.format(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.format('hh:mm tt');
};
export const timeParser = (text, param) => {
  if (!text) return [text, false];
  let value = moment(text); if (!value.isValid()) return [text, false];
  value = moment([0, 0, 0, value.hour(), value.minute(), value.second()]);
  if (param) { // check param
    let minValue = param.minValue, minValue2; if (minValue && value < moment(minValue)) return [value, false];
    let maxValue = param.maxValue, maxValue2; if (maxValue && value > moment(maxValue)) return [value, false];
  }
  return [value, true];
};