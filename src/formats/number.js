// bool
export const boolFormater = (value, param) => {
  //if (!value) return '';
  if (param) {
    switch (param.format) {
      case 'trueFalse': return value ? 'True' : 'False';
      case 'yesNo': return value ? 'Yes' : 'No';
      case 'values':
        let values = param.values; if (!values) throw new Error('param.values undefined');
        if (values.length != 2) throw new Error('param.values invalid');
        return value ? values[0] : values[1];
      default: throw new Error('param.format invalid');
    }
  }
  return value ? 'Yes' : 'No';
};
export const boolParser = (text, param, message) => {
  if (!text) return [text, true, message];
  switch (text.toLowerCase()) {
    case '1': case 'y': case 'true': case 'yes': case 'on': return [true, true, message];
    case '0': case 'n': case 'false': case 'no': case 'off': return [false, true, message];
    default: throw new Error('invalid value');
  }
};

// decimal
export const decimalFormater = (value, param) => {
  if (!value) return '';
  value = parseFloat(value);
  if (param) {
    switch (param.format) {
      case 'pattern': return value.toFixed(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.toFixed(4);
};
export const decimalParser = (text, param, message) => {
  if (!text) return [text, true, message];
  let value = parseFloat(text); if (isNaN(value)) return [text, false, message];
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < parseFloat(minValue)) return [value, false, message];
    let maxValue = param.maxValue; if (maxValue && value > parseFloat(maxValue)) return [value, false, message];
    let precision = param.precision; if (precision && value !== Math_round(value, precision)) return [value, false, message];
    let round = param.round; if (round) value = Math_round(value, round);
  }
  return [value, true, message];
};

// integer
export const integerFormater = (value, param) => {
  if (!value) return '';
  value = parseInt(value);
  if (param) {
    switch (param.format) {
      case 'comma': return format(value);
      case 'byte':
        let length = Math.floor(parseFloat((value.toString().length - 1)) / 3);
        if (length > 0) return Math_round(value / (2 << (10 * length)), 2).toString() + ' ' + '  KBMBGB'.substring(length * 2, 2);
        if (value == 1) return '1 byte';
        return value.toString() + ' bytes';
      case 'pattern': return value.toString(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.toString();
};
export const integerParser = (text, param, message) => {
  if (!text) return [text, true, message];
  let value = parseInt(text); if (isNaN(value)) return [text, false, message];
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < parseInt(minValue)) return [value, false, message];
    let maxValue = param.maxValue; if (maxValue && value > parseInt(maxValue)) return [value, false, message];
  }
  return [value, true, message];
};

// real
export const realFormater = (value, param) => {
  if (!value) return '';
  value = parseFloat(value);
  if (param) {
    switch (param.format) {
      case 'pattern': return value.toFixed(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.toFixed(4);
};
export const realParser = (text, param, message) => {
  if (!text) return [text, true, message];
  let value = parseFloat(text); if (isNaN(value)) return [text, false, message];
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < parseFloat(minValue)) return [value, false, message];
    let maxValue = param.maxValue; if (maxValue && value > parseFloat(maxValue)) return [value, false, message];
    let precision = param.precision; if (precision && value !== Math_round(value, precision)) return [value, false, message];
    let round = param.round; if (round) value = Math_round(value, round);
  }
  return [value, true, message];
};

// money
Number.prototype.formatMoney = function (c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
export const moneyFormater = (value, param) => {
  if (!value) return '';
  value = parseFloat(value);
  if (param) {
    switch (param.format) {
      case 'c3': return '$' + value.formatMoney(3);
      case 'c2': return '$' + value.formatMoney(2);
      case 'pattern': return '$' + value.formatMoney(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return '$' + value.formatMoney(2);
};
export const moneyParser = (text, param, message) => {
  if (!text) return [text, true, message];
  //if(!/^\d+$/.test(text)) return [text, false, message];
  text = text.replace(/[^0-9\.]+/g, ''); if (!text) return [text, false, message];
  let value = parseFloat(text); if (isNaN(value)) return [text, false, message];
  value = Math_round(value, 4);
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < parseFloat(minValue)) return [value, false, message];
    let maxValue = param.maxValue; if (maxValue && value > parseFloat(maxValue)) return [value, false, message];
    let precision = param.precision; if (precision && value !== Math_round(value, precision)) return [value, false, message];
    let round = param.round; if (round) value = Math_round(value, round);
  }
  return [value, true, message];
};

// percent
export const percentFormater = (value, param) => {
  if (!value) return '';
  value = parseFloat(value);
  if (param) {
    switch (param.format) {
      case 'pattern': return value.toString(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.toString('0.00') + '%';
};
export const percentParser = (text, param, message) => {
  if (!text) return [text, true, message];
  if (text && text[text.length - 1] === '%') text = text.substring(0, text.length - 1);
  let value = parseFloat(text); if (isNaN(value)) return [text, false, message];
  return [value, true, message];
};

function format(value) {
  if (isNaN(value)) return '';
  let n = value.toString().split('.');
  return n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (n.length > 1 ? '.' + n[1] : '');
}

function Math_round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}