// text
export const textFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const textParser = (text, param) => {
  if (!text) return [text, false];
  return [text, true];
};

// memo
export const memoFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const memoParser = (text, param) => {
  if (!text) return [text, false];
  if (param) { // check param
    let maxNonWhiteSpaceLength = param.maxNonWhiteSpaceLength; if (maxNonWhiteSpaceLength && /\s/.replace(text, '').length > maxNonWhiteSpaceLength) return [text, false];
    let maxLines = param.maxLines; if (maxLines && text.split('\r\n').length > maxLines) return [text, false];
  }
  return [text, true];
};

// regex
export const regexFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const regexParser = (text, param) => {
  if (!text) return [text, false];
  if (param) { // check param
    let pattern = param.pattern; if (pattern && !(new RegExp(pattern)).test(text)) return [text, false];
  }
  return [text, true];
};

