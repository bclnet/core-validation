import assert from 'power-assert';

import { nulFormat } from '../src/globals';
import {
    phoneFormatter, phoneParser,
    zipFormatter, zipParser,
} from '../src/formats/logistics';

describe('Phone', () => {
    it('should format', () => {
        expect(phoneFormatter(null)).toBe(nulFormat);
        expect(phoneFormatter('')).toBe(nulFormat);
        expect(phoneFormatter('816-304-4341')).toBe('816-304-4341');
    });
    it('should parse', () => {
        expect(phoneParser(null)).toEqual([null, true, undefined]);
        expect(phoneParser('')).toEqual(['', true, undefined]);
        expect(phoneParser('123-456')).toEqual(['123-456', false, undefined]);
        expect(phoneParser('123-456-7890.1234')).toEqual(['(123) 456-7890 x1234', true, undefined]);
        expect(phoneParser('123-456-7890')).toEqual(['(123) 456-7890', true, undefined]);
    });
    it('should parse: _', () => {
        const param = { countries: '' };
        expect(phoneParser('123.456.7890.1234', param)).toEqual(['(123) 456-7890 x1234', true, undefined]);
        expect(phoneParser('123.456.7890.1234', Object.assign(param, { layout: '-' }))).toEqual(['123-456-7890 x1234', true, undefined]);
        expect(phoneParser('123.456.7890.1234', Object.assign(param, { layout: '.' }))).toEqual(['123.456.7890 x1234', true, undefined]);
        expect(phoneParser('123.456.7890.1234', Object.assign(param, { layout: '()' }))).toEqual(['(123) 456-7890 x1234', true, undefined]);
    });
    it('should parse: *', () => {
        const param = { countries: '*' };
        expect(phoneParser('123-456-7890.1234', param)).toEqual(['123-456-7890.1234', true, undefined]);
        expect(phoneParser('123-456-7890', param)).toEqual(['123-456-7890', true, undefined]);
    });
    it('should parse: usa', () => {
        const param = { countries: 'u' };
        expect(phoneParser('123.456.7890.1234', param)).toEqual(['(123) 456-7890 x1234', true, undefined]);
        expect(phoneParser('123-456-7890', param)).toEqual(['(123) 456-7890', true, undefined]);
        expect(phoneParser('456-7890', param)).toEqual(['456-7890', false, undefined]);
    });
    it('should parse: canada', () => {
        const param = { countries: 'c' };
        expect(phoneParser('123.456.7890.1234', param)).toEqual(['(123) 456-7890 x1234', true, undefined]);
        expect(phoneParser('123-456-7890', param)).toEqual(['(123) 456-7890', true, undefined]);
        expect(phoneParser('456-7890', param)).toEqual(['456-7890', false, undefined]);
    });
    it('should parse: unknown', () => {
        const param = { countries: 'z' };
        expect(phoneParser('123.456.7890.1234', param)).toEqual(['123.456.7890.1234', false, undefined]);
    });
    it('should parse: layout', () => {
        expect(phoneParser('123.456.7890.1234', { countries: 'u', layout: '.' })).toEqual(['123.456.7890 x1234', true, undefined]);
        expect(phoneParser('123.456.7890.1234', { countries: 'u', layout: '-' })).toEqual(['123-456-7890 x1234', true, undefined]);
        expect(phoneParser('123.456.7890.1234', { countries: 'u', layout: '()' })).toEqual(['(123) 456-7890 x1234', true, undefined]);
        expect(() => phoneParser('123.456.7890.1234', { countries: 'u', layout: '*' })).toThrow(Error);
    });
});

describe('Zip', () => {
    it('should format', () => {
        expect(zipFormatter(null)).toBe(nulFormat);
        expect(zipFormatter('')).toBe(nulFormat);
        expect(zipFormatter('66211', {})).toBe('66211');
    });
    it('should parse', () => {
        expect(zipParser(null)).toEqual([null, true, undefined]);
        expect(zipParser('')).toEqual(['', true, undefined]);
        expect(zipParser('66211')).toEqual(['66211', true, undefined]);
    });
    it('should parse: _', () => {
        const param = { countries: '' };
        expect(zipParser('12345-0123', param)).toEqual(['12345-0123', true, undefined]);
    });
    it('should parse: *', () => {
        const param = { countries: '*' };
        expect(zipParser('123', param)).toEqual(['123', true, undefined]);
        expect(zipParser('12345', param)).toEqual(['12345', true, undefined]);
        expect(zipParser('12345-123', param)).toEqual(['12345-123', true, undefined]);
    });
    it('should parse: usa', () => {
        const param = { countries: 'u' };
        expect(zipParser('123', param)).toEqual(['00123', true, undefined]);
        expect(zipParser('12345', param)).toEqual(['12345', true, undefined]);
        expect(zipParser('123456', param)).toEqual(['123456', false, undefined]);
        expect(zipParser('12345-0123', param)).toEqual(['12345-0123', true, undefined]);
        expect(zipParser('12345-1234', param)).toEqual(['12345-1234', true, undefined]);
    });
    it('should parse: canada', () => {
        const param = { countries: 'c' };
        expect(zipParser('12345', param)).toEqual(['12345', false, undefined]);
        expect(zipParser('123 456', param)).toEqual(['123 456', false, undefined]);
        expect(zipParser('K8N 5W6', param)).toEqual(['K8N 5W6', true, undefined]);
    });
    it('should parse: unknown', () => {
        const param = { countries: 'z' };
        expect(zipParser('12345', param)).toEqual(['12345', false, undefined]);
    });
});
