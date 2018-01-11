import assert from 'power-assert';

import {
    emailFormater, emailParser,
    emailListFormater, emailListParser,
    hostnameFormater, hostnameParser,
    hostnameListFormater, hostnameListParser,
    uriFormater, uriParser,
    xmlFormater, xmlParser,
} from '../src/formats/internet';

describe('Email', () => {
    it('should format', () => {
        expect(emailFormater(null)).toBe('');
        expect(emailFormater('')).toBe('');
        expect(emailFormater('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(emailParser(null)).toEqual([null, false]);
        expect(emailParser('')).toEqual(['', false]);
        expect(emailParser('bad.com')).toEqual(['bad.com', false]);
        expect(emailParser('valid@email.com')).toEqual(['valid@email.com', true]);
    });
});

describe('Email List', () => {
    it('should format', () => {
        expect(emailListFormater(null)).toBe('');
        expect(emailListFormater('')).toBe('');
        expect(emailListFormater('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(emailListParser(null)).toEqual([null, false]);
        expect(emailListParser('')).toEqual(['', false]);
        expect(emailListParser('bad.com')).toEqual(['bad.com', false]);
        expect(emailListParser('valid@email.com')).toEqual(['valid@email.com', true]);
        // list
        expect(emailListParser('bad.com, valid@email.com')).toEqual(['bad.com, valid@email.com', false]);
        expect(emailListParser('valid@email.com, valid@email.com')).toEqual(['valid@email.com; valid@email.com', true]);
        expect(emailListParser('valid@email.com, ,valid@email.com')).toEqual(['valid@email.com; valid@email.com', true]);
    });
    it('should parse: maxCount', () => {
        expect(emailListParser('valid@email.com, valid@email.com', { maxCount: 1 })).toEqual(['valid@email.com, valid@email.com', false]);
        expect(emailListParser('valid@email.com, valid@email.com', { maxCount: 2 })).toEqual(['valid@email.com; valid@email.com', true]);
    });
});

describe('Hostname', () => {
    it('should format', () => {
        expect(hostnameFormater(null)).toBe('');
        expect(hostnameFormater('')).toBe('');
        expect(hostnameFormater('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(hostnameParser(null)).toEqual([null, false]);
        expect(hostnameParser('')).toEqual(['', false]);
        expect(hostnameParser('bad-com')).toEqual(['bad-com', false]);
        expect(hostnameParser('good.com')).toEqual(['good.com', true]);
    });
});

describe('Hostname List', () => {
    it('should format', () => {
        expect(hostnameListFormater(null)).toBe('');
        expect(hostnameListFormater('')).toBe('');
        expect(hostnameListFormater('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(hostnameListParser(null)).toEqual([null, false]);
        expect(hostnameListParser('')).toEqual(['', false]);
        expect(hostnameListParser('bad-com')).toEqual(['bad-com', false]);
        expect(hostnameListParser('good.com')).toEqual(['good.com', true]);
        // list
        expect(hostnameListParser('bad-com, good.com')).toEqual(['bad-com, good.com', false]);
        expect(hostnameListParser('good.com, good.com')).toEqual(['good.com; good.com', true]);
        expect(hostnameListParser('good.com, ,good.com')).toEqual(['good.com; good.com', true]);
    });
    it('should parse: maxCount', () => {
        expect(hostnameListParser('good.com, good.com', { maxCount: 1 })).toEqual(['good.com, good.com', false]);
        expect(hostnameListParser('good.com, good.com', { maxCount: 2 })).toEqual(['good.com; good.com', true]);
    });
});

describe('Uri', () => {
    it('should format', () => {
        expect(uriFormater(null)).toBe('');
        expect(uriFormater('')).toBe('');
        expect(uriFormater('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(uriParser(null)).toEqual([null, false]);
        expect(uriParser('')).toEqual(['', false]);
        expect(uriParser('anything')).toEqual(['anything', true]);
    });
});

describe('Xml', () => {
    it('should format', () => {
        expect(xmlFormater(null)).toBe('');
        expect(xmlFormater('')).toBe('');
        expect(xmlFormater('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(xmlParser(null)).toEqual([null, false]);
        expect(xmlParser('')).toEqual(['', false]);
        expect(xmlParser('anything')).toEqual(['anything', true]);
    });
});
