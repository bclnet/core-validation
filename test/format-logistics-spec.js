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
        expect(phoneParser(null)).toEqual([null, false]);
        expect(phoneParser('')).toEqual(['', false]);
        expect(phoneParser('123-456-7890.1234')).toEqual(['123-456-7890 x1234', true]);
        expect(phoneParser('123-456-7890')).toEqual(['123-456-7890', true]);
    });
    it('should parse: *', () => {
        let params = { countries: '*' };
        expect(phoneParser(null, params)).toEqual([null, false]);
        expect(phoneParser('', params)).toEqual(['', false]);
        expect(phoneParser('123-456-7890.1234', params)).toEqual(['123-456-7890.1234', true]);
        expect(phoneParser('123-456-7890', params)).toEqual(['123-456-7890', true]);
    });
    it('should parse: usa', () => {
        let params = { countries: 'u' };
        expect(phoneParser('123.456.7890.1234', params)).toEqual(['123-456-7890 x1234', true]);
        expect(phoneParser('123-456-7890', params)).toEqual(['123-456-7890', true]);
        expect(phoneParser('456-7890', params)).toEqual(['456-7890', false]);
    });
    it('should parse: canada', () => {
        let params = { countries: 'c' };
        expect(phoneParser('123.456.7890.1234', params)).toEqual(['123-456-7890 x1234', true]);
        expect(phoneParser('123-456-7890', params)).toEqual(['123-456-7890', true]);
        expect(phoneParser('456-7890', params)).toEqual(['456-7890', false]);
    });
});

describe('Zip', () => {
    it('should format', () => {
        expect(zipFormater(null)).toBe('');
        expect(zipFormater('')).toBe('');
        expect(zipFormater('66211', {})).toBe('66211');
    });
    it('should parse', () => {
        expect(zipParser(null)).toEqual([null, false]);
        expect(zipParser('')).toEqual(['', false]);
        expect(zipParser('66211')).toEqual(['66211', true]);
    });
    it('should parse: *', () => {
        let params = { countries: '*' };
        expect(zipParser('123', params)).toEqual(['123', true]);
        expect(zipParser('12345', params)).toEqual(['12345', true]);
        expect(zipParser('12345-123', params)).toEqual(['12345-123', true]);
    });
    it('should parse: usa', () => {
        let params = { countries: 'u' };
        expect(zipParser('123', params)).toEqual(['00123', true]);
        expect(zipParser('12345', params)).toEqual(['12345', true]);
        expect(zipParser('12345-0123', params)).toEqual(['12345-0123', true]);
        expect(zipParser('12345-1234', params)).toEqual(['12345-1234', true]);
    });
    it('should parse: canada', () => {
        let params = { countries: 'c' };
        expect(zipParser('12345', params)).toEqual(['12345', false]);
        expect(zipParser('123 456', params)).toEqual(['123 456', false]);
        expect(zipParser('K8N 5W6', params)).toEqual(['K8N 5W6', true]);
    });
});
