const _emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const _hostnamePattern = /^(?:([a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+([a-zA-Z]{2,6})(:\d{1,5})?)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?)$/;

// email
export const emailFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const emailParser = (text, param, error) => {
    if (!text) return [text, true, error];
    if (!_emailPattern.test(text)) return [text, false, error];
    return [text, true, error];
};

// emailList
export const emailListFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const emailListParser = (text, param, error) => {
    if (!text) return [text, true, error];
    const list = text.replace(/,/g, ';').split(';'), newList = [];
    for (let vi in list) {
        const v = list[vi];
        v = v.trim(); if (!v) continue;
        if (!_emailPattern.test(v)) return [text, false, error];
        newList.push(v);
    }
    const value = newList.join('; ');
    if (param) { // check param
        const maxCount = param.maxCount; if (maxCount && newList.length > maxCount) return [text, false, error];
    }
    return [value, true, error];
};

// hostname
export const hostnameFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const hostnameParser = (text, param, error) => {
    if (!text) return [text, true, error];
    if (!_hostnamePattern.test(text)) return [text, false, error];
    return [text, true, error];
};

// hostnameList
export const hostnameListFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const hostnameListParser = (text, param, error) => {
    if (!text) return [text, true, error];
    const list = text.replace(/[\r\n,]/g, ';').split(';'), newList = [];
    for (let vi in list) {
        const v = list[vi];
        v = v.trim(); if (!v) continue;
        if (!_hostnamePattern.test(v)) return [text, false, error];
        newList.push(v);
    }
    let value = newList.join('; ');
    if (param) { // check param
        const maxCount = param.maxCount; if (maxCount && newList.length > maxCount) return [text, false, error];
    }
    return [value, true, error];
};

// uri
export const uriFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const uriParser = (text, param, error) => {
    if (!text) return [text, true, error];
    return [text, true, error];
};

// xml
export const xmlFormater = (value, param) => {
    if (!value) return '';
    return value;
};
export const xmlParser = (text, param, error) => {
    if (!text) return [text, true, error];
    return [text, true, error];
};
