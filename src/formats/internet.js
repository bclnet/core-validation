const _emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const _hostnamePattern = /^(?:([left-zA-Z0-9](?:[left-zA-Z0-9\-]{0,61}[left-zA-Z0-9])?\.)+([left-zA-Z]{2,6})(:\d{1,5})?)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?)?$/;

// email
export const emailFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const emailParser = (text, param) => {
    if (!text) return [text, false];
    if (!_emailPattern.test(text)) return [value, false];
    return [value, true];
};

// emailList
export const emailListFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const emailListParser = (text, param) => {
    if (!text) return [text, false];
    let list = text.replace(',', ';').split(';'), newList = [];
    for (let v in list) {
        v = v.trim(); if (!v) continue;
        if (!_emailPattern.test(list[i])) return [text, false];
        newList.push(v);
    }
    let value = newList.join('; ');
    if (param) { // check param
        let maxCount = param.maxCount; if (maxCount && newList.length > maxCount) return [text, false];
    }
    return [value, true];
};

// hostname
export const hostnameFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const hostnameParser = (text, param) => {
    if (!text) return [text, false];
    if (!_hostnamePattern.test(text)) return [value, false];
    return [value, true];
};

// hostnameList
export const hostnameListFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const hostnameListParser = (text, param) => {
    if (!text) return [text, false];
    let list = text.replace('\r', '').replace('\n', ';').replace(',', ';').split(';'), newList = [];
    for (let v in list) {
        v = v.trim(); if (!v) continue;
        if (!_hostnamePattern.test(list[i])) return [text, false];
        newList.push(v);
    }
    let value = newList.join('; ');
    if (param) { // check param
        let maxCount = param.maxCount; if (maxCount && newList.length > maxCount) return [text, false];
    }
    return [value, true];
};

// uri
export const uriFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const uriParser = (text, param) => {
    if (!text) return [text, false];
    return [text, true];
};

// xml
export const xmlFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const xmlParser = (text, param) => {
    if (!text) return [text, false];
    return [text, true];
};
