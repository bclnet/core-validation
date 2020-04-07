import assert from 'power-assert';

import {
    textFormater, textParser,
    memoFormater, memoParser,
    regexFormater, regexParser,
} from '../src/formats/string';

describe('Text', () => {
    it('should format', () => {
        expect(textFormater(null)).toBe('');
        expect(textFormater('')).toBe('');
        expect(textFormater('12')).toBe('12');
    });
    it('should parse', () => {
        expect(textParser(null)).toEqual([null, true, undefined]);
        expect(textParser('')).toEqual(['', true, undefined]);
        expect(textParser('123-456')).toEqual(['123-456', true, undefined]);
    });
});

describe('Memo', () => {
    it('should format', () => {
        expect(memoFormater(null)).toBe('');
        expect(memoFormater('')).toBe('');
        expect(memoFormater('12')).toBe('12');
    });
    it('should parse', () => {
        expect(memoParser(null)).toEqual([null, true, undefined]);
        expect(memoParser('')).toEqual(['', true, undefined]);
        expect(memoParser('123-456')).toEqual(['123-456', true, undefined]);
    });
    it('should parse: maxNonWhiteSpaceLength', () => {
        expect(memoParser('12345', { maxNonWhiteSpaceLength: 4 })).toEqual(['12345', false, undefined]);
        expect(memoParser('12 3 45', { maxNonWhiteSpaceLength: 4 })).toEqual(['12 3 45', false, undefined]);
        expect(memoParser('12  3 4', { maxNonWhiteSpaceLength: 4 })).toEqual(['12  3 4', true, undefined]);
    });
    it('should parse: maxLines', () => {
        expect(memoParser('1\n2\n3', { maxLines: 2 })).toEqual(['1\n2\n3', false, undefined]);
        expect(memoParser('1\n2', { maxLines: 2 })).toEqual(['1\n2', true, undefined]);
    });
});

describe('Regex', () => {
    it('should format', () => {
        expect(regexFormater(null)).toBe('');
        expect(regexFormater('')).toBe('');
        expect(regexFormater('12')).toBe('12');
    });
    it('should parse', () => {
        expect(regexParser(null)).toEqual([null, true, undefined]);
        expect(regexParser('')).toEqual(['', true, undefined]);
        expect(regexParser('123-456')).toEqual(['123-456', true, undefined]);
    });
    it('should parse: pattern', () => {
        const param = { pattern: /^((0[1-9])|(1[0-2]))[\/-](([0-2][0-9])|([3][0-1]))$/ };
        expect(regexParser('2017-01-01', param)).toEqual(['2017-01-01', false, undefined]);
        expect(regexParser('09-12', param)).toEqual(['09-12', true, undefined]);
    });
});