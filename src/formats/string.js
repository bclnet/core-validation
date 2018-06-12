// text
export const textFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const textParser = (text, param, message) => {
  if (!text) return [text, true, message];
  return [text, true, message];
};

// memo
export const memoFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const memoParser = (text, param, message) => {
  if (!text) return [text, true, message];
  if (param) { // check param
    let maxNonWhiteSpaceLength = param.maxNonWhiteSpaceLength; if (maxNonWhiteSpaceLength && /\s/.replace(text, '').length > maxNonWhiteSpaceLength) return [text, false, message];
    let maxLines = param.maxLines; if (maxLines && text.split('\r\n').length > maxLines) return [text, false, message];
  }
  return [text, true, message];
};

// regex
export const regexFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const regexParser = (text, param, message) => {
  if (!text) return [text, true, message];
  if (param) { // check param
    let pattern = param.pattern; if (pattern && !(new RegExp(pattern)).test(text)) return [text, false, message];
  }
  return [text, true, message];
};

