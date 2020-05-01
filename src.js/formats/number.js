import { nulFormat } from '../globals';

// bool
export const boolFormater = (value, param) => {
  if (value == undefined) return nulFormat;
  if (param && param.format) {
    switch (param.format) {
      case 'trueFalse': return value ? 'True' : 'False';
      case 'yesNo': return value ? 'Yes' : 'No';
      case 'values':
        const values = param.values;
        if (values) {
          if (values.length != 2) throw new Error('param.values invalid');
          return value ? values[0] : values[1];
        }
        throw new Error('param.values undefined');
      default: throw new Error('param.format invalid');
    }
  }
  return value ? 'Yes' : 'No';
};
export const boolParser = (text, param, error) => {
  if (!text) return [text, true, error];
  switch (text.toLowerCase()) {
    case '1': case 'y': case 'true': case 'yes': case 'on': return [true, true, error];
    case '0': case 'n': case 'false': case 'no': case 'off': return [false, true, error];
    default: return [text, false, error];
  }
};

// decimal
export const decimalFormater = (value, param) => {
  if (!value) return nulFormat;
  value = parseFloat(value);
  if (param && param.format) {
    switch (param.format) {
      case 'comma': return Format_comma(value);
      case 'n2': return value.toFixed(2);
      case 'n3': return value.toFixed(3);
      case 'pattern': return value.toFixed(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.toFixed(4);
};
export const decimalParser = (text, param, error) => {
  if (!text) return [text, true, error];
  let value = parseFloat(text); if (isNaN(value)) return [text, false, error];
  if (param) { // check param
    const minValue = param.minValue; if (minValue && value < parseFloat(minValue)) return [value, false, error];
    const maxValue = param.maxValue; if (maxValue && value > parseFloat(maxValue)) return [value, false, error];
    const precision = param.precision; if (precision && value !== Math_round(value, precision)) return [value, false, error];
    const round = param.round; if (round) value = Math_round(value, round);
  }
  return [value, true, error];
};

// integer
export const integerFormater = (value, param) => {
  if (!value) return nulFormat;
  value = parseInt(value);
  if (param && param.format) {
    switch (param.format) {
      case 'comma': return Format_comma(value);
      case 'byte':
        const radix = Math.floor((value.toString().length - 1) / 3);
        if (radix > 0) return `${Math_round(value / (1 << (10 * radix)), 2)} ${'  KBMBGB'.substring(radix << 1, (radix << 1) + 2)}`;
        if (value == 1) return '1 byte';
        return `${value} bytes`;
      case 'pattern': return value.toString(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.toString();
};
export const integerParser = (text, param, error) => {
  if (!text) return [text, true, error];
  let value = parseInt(text); if (isNaN(value)) return [text, false, error];
  if (param) { // check param
    const minValue = param.minValue; if (minValue && value < parseInt(minValue)) return [value, false, error];
    const maxValue = param.maxValue; if (maxValue && value > parseInt(maxValue)) return [value, false, error];
  }
  return [value, true, error];
};

// real
export const realFormater = (value, param) => {
  if (!value) return nulFormat;
  value = parseFloat(value);
  if (param && param.format) {
    switch (param.format) {
      case 'comma': return Format_comma(value);
      case 'n2': return value.toFixed(2);
      case 'n3': return value.toFixed(3);
      case 'pattern': return value.toFixed(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.toFixed(4);
};
export const realParser = (text, param, error) => {
  if (!text) return [text, true, error];
  let value = parseFloat(text); if (isNaN(value)) return [text, false, error];
  if (param) { // check param
    const minValue = param.minValue; if (minValue && value < parseFloat(minValue)) return [value, false, error];
    const maxValue = param.maxValue; if (maxValue && value > parseFloat(maxValue)) return [value, false, error];
    const precision = param.precision; if (precision && value !== Math_round(value, precision)) return [value, false, error];
    const round = param.round; if (round) value = Math_round(value, round);
  }
  return [value, true, error];
};

// money
/* istanbul ignore next */
Number.prototype.formatMoney = function (c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? '.' : d,
    t = t == undefined ? ',' : t,
    s = n < 0 ? '-' : '',
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};
export const moneyFormater = (value, param) => {
  if (!value) return nulFormat;
  value = parseFloat(value);
  if (param && param.format) {
    switch (param.format) {
      case 'c2': return `$${value.formatMoney(2)}`;
      case 'c3': return `$${value.formatMoney(3)}`;
      case 'pattern': return `$${value.formatMoney(param.pattern)}`;
      default: throw new Error('param.format invalid');
    }
  }
  return `$${value.formatMoney(2)}`;
};
export const moneyParser = (text, param, error) => {
  if (!text) return [text, true, error];
  //if(!/^\d+$/.test(text)) return [text, false, error];
  text = text.replace(/[^0-9\.]+/g, ''); if (!text) return [text, false, error];
  let value = parseFloat(text); //if (isNaN(value)) return [text, false, error];
  value = Math_round(value, 4);
  if (param) { // check param
    const minValue = param.minValue; if (minValue && value < parseFloat(minValue)) return [value, false, error];
    const maxValue = param.maxValue; if (maxValue && value > parseFloat(maxValue)) return [value, false, error];
    const precision = param.precision; if (precision && value !== Math_round(value, precision)) return [value, false, error];
    const round = param.round; if (round) value = Math_round(value, round);
  }
  return [value, true, error];
};

// percent
export const percentFormater = (value, param) => {
  if (!value) return nulFormat;
  value = parseFloat(value);
  if (param && param.format) {
    switch (param.format) {
      case 'p2': return `${(value * 100).toFixed(2)}%`;
      case 'p3': return `${(value * 100).toFixed(3)}%`;
      case 'p4': return `${(value * 100).toFixed(4)}%`;
      case 'pattern': return `${(value * 100).toFixed(param.pattern)}%`;
      default: throw new Error('param.format invalid');
    }
  }
  return `${(value * 100).toFixed(2).toString()}%`;
};
export const percentParser = (text, param, error) => {
  if (!text) return [text, true, error];
  if (text[text.length - 1] === '%') text = text.substring(0, text.length - 1);
  let value = parseFloat(text); if (isNaN(value)) return [text, false, error];
  return [value / 100, true, error];
};

/* istanbul ignore next */
function Format_comma(value) {
  if (isNaN(value)) return '';
  const n = value.toString().split('.');
  return n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (n.length > 1 ? '.' + n[1] : '');
}

/* istanbul ignore next */
function Math_round(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
}