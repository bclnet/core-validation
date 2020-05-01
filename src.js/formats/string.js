import { nulFormat } from '../globals';

// text
export const textFormater = (value, param) => {
  if (!value) return nulFormat;
  return value;
};
export const textParser = (text, param, error) => {
  if (!text) return [text, true, error];
  return [text, true, error];
};

// memo
export const memoFormater = (value, param) => {
  if (!value) return nulFormat;
  return value;
};
export const memoParser = (text, param, error) => {
  if (!text) return [text, true, error];
  if (param) { // check param
    const maxNonWhiteSpaceLength = param.maxNonWhiteSpaceLength; if (maxNonWhiteSpaceLength && text.replace(/\s/g, '').length > maxNonWhiteSpaceLength) return [text, false, error];
    const maxLines = param.maxLines; if (maxLines && text.split('\n').length > maxLines) return [text, false, error];
  }
  return [text, true, error];
};

// regex
export const regexFormater = (value, param) => {
  if (!value) return nulFormat;
  return value;
};
export const regexParser = (text, param, error) => {
  if (!text) return [text, true, error];
  if (param) { // check param
    const pattern = param.pattern; if (pattern && !new RegExp(pattern).test(text)) return [text, false, error];
  }
  return [text, true, error];
};

