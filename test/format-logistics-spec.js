import assert from 'power-assert';

import {
    phoneFormater, phoneParser,
    zipFormater, zipParser,
} from '../src/formats/logistics';

describe('Phone', () => {
    it('should format', () => {
        expect(phoneFormater(null)).toBe('');
        expect(phoneFormater('')).toBe('');
        expect(phoneFormater('816-304-4341')).toBe('816-304-4341');
    });
    it('should parse', () => {
        expect(phoneParser(null)).toEqual([null, true, undefined]);
        expect(phoneParser('')).toEqual(['', true, undefined]);
        expect(phoneParser('123-456')).toEqual(['123-456', false, undefined]);
        expect(phoneParser('123-456-7890.1234')).toEqual(['(123) 456-7890 x1234', true, undefined]);
        expect(phoneParser('123-456-7890')).toEqual(['(123) 456-7890', true, undefined]);
    });
    it('should parse: _', () => {
        let params = { countries: '' };
        expect(phoneParser('123.456.7890.1234', params)).toEqual(['(123) 456-7890 x1234', true, undefined]);
        expect(phoneParser('123.456.7890.1234', Object.assign(params, { layout: '-' }))).toEqual(['123-456-7890 x1234', true, undefined]);
        expect(phoneParser('123.456.7890.1234', Object.assign(params, { layout: '.' }))).toEqual(['123.456.7890 x1234', true, undefined]);
        expect(phoneParser('123.456.7890.1234', Object.assign(params, { layout: '()' }))).toEqual(['(123) 456-7890 x1234', true, undefined]);
    });
    it('should parse: *', () => {
        let params = { countries: '*' };
        expect(phoneParser('123-456-7890.1234', params)).toEqual(['123-456-7890.1234', true, undefined]);
        expect(phoneParser('123-456-7890', params)).toEqual(['123-456-7890', true, undefined]);
    });
    it('should parse: usa', () => {
        let params = { countries: 'u' };
        expect(phoneParser('123.456.7890.1234', params)).toEqual(['(123) 456-7890 x1234', true, undefined]);
        expect(phoneParser('123-456-7890', params)).toEqual(['(123) 456-7890', true, undefined]);
        expect(phoneParser('456-7890', params)).toEqual(['456-7890', false, undefined]);
    });
    it('should parse: canada', () => {
        let params = { countries: 'c' };
        expect(phoneParser('123.456.7890.1234', params)).toEqual(['(123) 456-7890 x1234', true, undefined]);
        expect(phoneParser('123-456-7890', params)).toEqual(['(123) 456-7890', true, undefined]);
        expect(phoneParser('456-7890', params)).toEqual(['456-7890', false, undefined]);
    });
    it('should parse: unknown', () => {
        let params = { countries: 'z' };
        expect(phoneParser('123.456.7890.1234', params)).toEqual(['123.456.7890.1234', false, undefined]);
    });
});

describe('Zip', () => {
    it('should format', () => {
        expect(zipFormater(null)).toBe('');
        expect(zipFormater('')).toBe('');
        expect(zipFormater('66211', {})).toBe('66211');
    });
    it('should parse', () => {
        expect(zipParser(null)).toEqual([null, true, undefined]);
        expect(zipParser('')).toEqual(['', true, undefined]);
        expect(zipParser('66211')).toEqual(['66211', true, undefined]);
    });
    it('should parse: _', () => {
        let params = { countries: '' };
        expect(zipParser('12345-0123', params)).toEqual(['12345-0123', true, undefined]);
    });
    it('should parse: *', () => {
        let params = { countries: '*' };
        expect(zipParser('123', params)).toEqual(['123', true, undefined]);
        expect(zipParser('12345', params)).toEqual(['12345', true, undefined]);
        expect(zipParser('12345-123', params)).toEqual(['12345-123', true, undefined]);
    });
    it('should parse: usa', () => {
        let params = { countries: 'u' };
        expect(zipParser('123', params)).toEqual(['00123', true, undefined]);
        expect(zipParser('12345', params)).toEqual(['12345', true, undefined]);
        expect(zipParser('123456', params)).toEqual(['123456', false, undefined]);
        expect(zipParser('12345-0123', params)).toEqual(['12345-0123', true, undefined]);
        expect(zipParser('12345-1234', params)).toEqual(['12345-1234', true, undefined]);
    });
    it('should parse: canada', () => {
        let params = { countries: 'c' };
        expect(zipParser('12345', params)).toEqual(['12345', false, undefined]);
        expect(zipParser('123 456', params)).toEqual(['123 456', false, undefined]);
        expect(zipParser('K8N 5W6', params)).toEqual(['K8N 5W6', true, undefined]);
    });
    it('should parse: unknown', () => {
        let params = { countries: 'z' };
        expect(zipParser('12345', params)).toEqual(['12345', false, undefined]);
    });
});
