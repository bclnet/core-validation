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
    const maxNonWhiteSpaceLength = param.maxNonWhiteSpaceLength; if (maxNonWhiteSpaceLength && text.replace(/\s/g, '').length > maxNonWhiteSpaceLength) return [text, false, message];
    const maxLines = param.maxLines; if (maxLines && text.split('\n').length > maxLines) return [text, false, message];
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
    const pattern = param.pattern; if (pattern && !(new RegExp(pattern)).test(text)) return [text, false, message];
  }
  return [text, true, message];
};

