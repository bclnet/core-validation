import assert from 'power-assert';

import { nulFormat } from '../src/globals';
import {
    emailFormatter, emailParser,
    emailListFormatter, emailListParser,
    hostnameFormatter, hostnameParser,
    hostnameListFormatter, hostnameListParser,
    uriFormatter, uriParser,
    xmlFormatter, xmlParser,
} from '../src/formats/internet';

describe('Email', () => {
    it('should format', () => {
        expect(emailFormatter(null)).toBe(nulFormat);
        expect(emailFormatter('')).toBe(nulFormat);
        expect(emailFormatter('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(emailParser(null)).toEqual([null, true, undefined]);
        expect(emailParser('')).toEqual(['', true, undefined]);
        expect(emailParser('bad.com')).toEqual(['bad.com', false, undefined]);
        expect(emailParser('valid@email.com')).toEqual(['valid@email.com', true, undefined]);
    });
});

describe('Email List', () => {
    it('should format', () => {
        expect(emailListFormatter(null)).toBe(nulFormat);
        expect(emailListFormatter('')).toBe(nulFormat);
        expect(emailListFormatter('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(emailListParser(null)).toEqual([null, true, undefined]);
        expect(emailListParser('')).toEqual(['', true, undefined]);
        expect(emailListParser('bad.com')).toEqual(['bad.com', false, undefined]);
        expect(emailListParser('valid@email.com')).toEqual(['valid@email.com', true, undefined]);
        // list
        expect(emailListParser('bad.com, valid@email.com')).toEqual(['bad.com, valid@email.com', false, undefined]);
        expect(emailListParser('valid@email.com, valid@email.com')).toEqual(['valid@email.com; valid@email.com', true, undefined]);
        expect(emailListParser('valid@email.com, ,valid@email.com')).toEqual(['valid@email.com; valid@email.com', true, undefined]);
    });
    it('should parse: maxCount', () => {
        expect(emailListParser('valid@email.com, valid@email.com', { maxCount: 1 })).toEqual(['valid@email.com, valid@email.com', false, undefined]);
        expect(emailListParser('valid@email.com, valid@email.com', { maxCount: 2 })).toEqual(['valid@email.com; valid@email.com', true, undefined]);
    });
});

describe('Hostname', () => {
    it('should format', () => {
        expect(hostnameFormatter(null)).toBe(nulFormat);
        expect(hostnameFormatter('')).toBe(nulFormat);
        expect(hostnameFormatter('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(hostnameParser(null)).toEqual([null, true, undefined]);
        expect(hostnameParser('')).toEqual(['', true, undefined]);
        expect(hostnameParser('bad-com')).toEqual(['bad-com', false, undefined]);
        expect(hostnameParser('good.com')).toEqual(['good.com', true, undefined]);
    });
});

describe('Hostname List', () => {
    it('should format', () => {
        expect(hostnameListFormatter(null)).toBe(nulFormat);
        expect(hostnameListFormatter('')).toBe(nulFormat);
        expect(hostnameListFormatter('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(hostnameListParser(null)).toEqual([null, true, undefined]);
        expect(hostnameListParser('')).toEqual(['', true, undefined]);
        expect(hostnameListParser('bad-com')).toEqual(['bad-com', false, undefined]);
        expect(hostnameListParser('good.com')).toEqual(['good.com', true, undefined]);
        // list
        expect(hostnameListParser('bad-com, good.com')).toEqual(['bad-com, good.com', false, undefined]);
        expect(hostnameListParser('good.com, good.com')).toEqual(['good.com; good.com', true, undefined]);
        expect(hostnameListParser('good.com, ,good.com')).toEqual(['good.com; good.com', true, undefined]);
    });
    it('should parse: maxCount', () => {
        expect(hostnameListParser('good.com, good.com', { maxCount: 1 })).toEqual(['good.com, good.com', false, undefined]);
        expect(hostnameListParser('good.com, good.com', { maxCount: 2 })).toEqual(['good.com; good.com', true, undefined]);
    });
});

describe('Uri', () => {
    it('should format', () => {
        expect(uriFormatter(null)).toBe(nulFormat);
        expect(uriFormatter('')).toBe(nulFormat);
        expect(uriFormatter('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(uriParser(null)).toEqual([null, true, undefined]);
        expect(uriParser('')).toEqual(['', true, undefined]);
        expect(uriParser('anything')).toEqual(['anything', true, undefined]);
    });
});

describe('Xml', () => {
    it('should format', () => {
        expect(xmlFormatter(null)).toBe(nulFormat);
        expect(xmlFormatter('')).toBe(nulFormat);
        expect(xmlFormatter('anything')).toBe('anything');
    });
    it('should parse', () => {
        expect(xmlParser(null)).toEqual([null, true, undefined]);
        expect(xmlParser('')).toEqual(['', true, undefined]);
        expect(xmlParser('anything')).toEqual(['anything', true, undefined]);
    });
});
