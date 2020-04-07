const _emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const _hostnamePattern = /^(?:([a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+([a-zA-Z]{2,6})(:\d{1,5})?)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?)$/;

// email
export const emailFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const emailParser = (text, param, message) => {
    if (!text) return [text, true, message];
    if (!_emailPattern.test(text)) return [text, false, message];
    return [text, true, message];
};

// emailList
export const emailListFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const emailListParser = (text, param, message) => {
    if (!text) return [text, true, message];
    const list = text.replace(/,/g, ';').split(';'), newList = [];
    for (let vi in list) {
        const v = list[vi];
        v = v.trim(); if (!v) continue;
        if (!_emailPattern.test(v)) return [text, false, message];
        newList.push(v);
    }
    const value = newList.join('; ');
    if (param) { // check param
        const maxCount = param.maxCount; if (maxCount && newList.length > maxCount) return [text, false, message];
    }
    return [value, true, message];
};

// hostname
export const hostnameFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const hostnameParser = (text, param, message) => {
    if (!text) return [text, true, message];
    if (!_hostnamePattern.test(text)) return [text, false, message];
    return [text, true, message];
};

// hostnameList
export const hostnameListFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const hostnameListParser = (text, param, message) => {
    if (!text) return [text, true, message];
    const list = text.replace(/[\r\n,]/g, ';').split(';'), newList = [];
    for (let vi in list) {
        const v = list[vi];
        v = v.trim(); if (!v) continue;
        if (!_hostnamePattern.test(v)) return [text, false, message];
        newList.push(v);
    }
    let value = newList.join('; ');
    if (param) { // check param
        const maxCount = param.maxCount; if (maxCount && newList.length > maxCount) return [text, false, message];
    }
    return [value, true, message];
};

// uri
export const uriFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const uriParser = (text, param, message) => {
    if (!text) return [text, true, message];
    return [text, true, message];
};

// xml
export const xmlFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const xmlParser = (text, param, message) => {
    if (!text) return [text, true, message];
    return [text, true, message];
};
