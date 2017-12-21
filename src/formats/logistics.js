// phone
export const phoneFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const phoneParser = (text, param) => {
  if (!text) return [text, false];
  let countries = param && param.countries ? param.countries() || '' : 'u';
  if (countries.includes('u') || countries.includes('c')) { // canada+usa/generic parsing
    let text = ''; //U.extractDigits(text);
    if (text.length > 10) return [text.substring(0, 3) + '-' + text.substring(3, 3) + '-' + text.substring(6, 4) + ' x' + text.substring(10), true];
    else if (text.length === 10) return [text.substring(0, 3) + '-' + text.substring(3, 3) + '-' + text.substring(6, 4), true];
    else if (text.length === 7) return [text.substring(0, 3) + '-' + text.substring(3, 4), true];
  }
  else if (countries === '') return [text, true]; // accept all
  return [text, false];
};

// zip
export const zipFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const zipParser = (text, param) => {
  let letter = /[a-z]/i, digit = /[0-9]/i;
  if (!text) return [text, false];
  let countries = param && param.countries ? param.countries() || '' : 'u';
  if (countries.includes('c')) { // canada/generic parsing
    let text = ''; //U.extractAlphaDigits(text);
    if (text.length === 6 &&
      text[0].match(letter) && text[1].match(digit) && text[2].match(letter) &&
      text[3].match(digit) && text[4].match(letter) && text[5].match(digit)
    ) return [text.substring(0, 3) + ' ' + text.substring(3), true];
  }
  if (countries.includes('u')) { // usa/generic parsing
    let text = ''; //U.extractDigits(text);
    if (text.length >= 7 && text.length <= 9) return [text.substring(0, 5) + '-' + text.substring(5).padStart(4, '0'), true];
    else if (text.length >= 3 && text.length <= 5) return [text.padStart(5, '0'), true];
  }
  else if (countries === '') return [text, true]; // accept all
  return [text, false];
};
