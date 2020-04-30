const _letterPattern = /[a-z]/i;
const _digitsPattern = /\d/i;
const _notDigitsPattern = /\D/gi;
const _notAlphaDigitsPattern = /[^0-9a-z]/gi;

// phone
export const phoneFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const phoneParser = (text, param, error) => {
  if (!text) return [text, true, error];
  const countries = (param ? param.countries : null) || 'u';
  if (countries.includes('u') || countries.includes('c')) { // canada+usa/generic parsing
    const layout = (param ? param.layout : null) || '()';
    const ntext = text.replace(_notDigitsPattern, '');
    if (ntext.length >= 10) { // 7
      const v = [ntext.substring(0, 3), ntext.substring(3, 6), ntext.substring(6, 10), ntext.length > 10 ? ` x${ntext.substring(10)}` : ''];
      switch (layout) {
        case '.': return [`${v[0]}.${v[1]}.${v[2]}${v[3]}`, true, error];
        case '-': return [`${v[0]}-${v[1]}-${v[2]}${v[3]}`, true, error];
        case '()': return [`(${v[0]}) ${v[1]}-${v[2]}${v[3]}`, true, error];
        default: throw new Error('param.layout invalid');
      }
    }
  }
  else if (countries === '*') return [text, true, error]; // accept all
  return [text, false, error];
};

// zip
export const zipFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const zipParser = (text, param, error) => {
  if (!text) return [text, true, error];
  const countries = param ? param.countries || 'u' : 'u';
  if (countries.includes('c')) { // canada/generic parsing
    const ntext = text.replace(_notAlphaDigitsPattern, '');
    if (ntext.length === 6 &&
      _letterPattern.test(ntext[0]) && _digitsPattern.test(ntext[1]) && _letterPattern.test(ntext[2]) &&
      _digitsPattern.test(ntext[3]) && _letterPattern.test(ntext[4]) && _digitsPattern.test(ntext[5])
    ) return [`${ntext.substring(0, 3)} ${ntext.substring(3)}`, true, error];
  }
  if (countries.includes('u')) { // usa/generic parsing
    const ntext = text.replace(_notDigitsPattern, '');
    if (ntext.length >= 7 && ntext.length <= 9) return [`${ntext.substring(0, 5)}-${ntext.substring(5).padStart(4, '0')}`, true, error];
    else if (ntext.length >= 3 && ntext.length <= 5) return [ntext.padStart(5, '0'), true, error];
  }
  else if (countries === '*') return [text, true, error]; // accept all
  return [text, false, error];
};
