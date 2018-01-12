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
        expect(textParser(null)).toEqual([null, false]);
        expect(textParser('')).toEqual(['', false]);
        expect(textParser('123-456')).toEqual(['123-456', true]);
    });
});

describe('Memo', () => {
    it('should format', () => {
        expect(memoFormater(null)).toBe('');
        expect(memoFormater('')).toBe('');
        expect(memoFormater('12')).toBe('12');
    });
    it('should parse', () => {
        expect(memoParser(null)).toEqual([null, false]);
        expect(memoParser('')).toEqual(['', false]);
        expect(memoParser('123-456')).toEqual(['123-456', true]);
    });
    // it('should parse: maxNonWhiteSpaceLength', () => {
    //     let param = { maxNonWhiteSpaceLength: true };
    //     expect(memoParser('2017-01-01', param)).toBe('01 January 2017');
    // });
    // it('should parse: maxNonWhiteSpaceLength', () => {
    //     let param = { maxLines: true };
    //     expect(memoParser('2017-01-01', param)).toBe('01 January 2017');
    // });
});

describe('Regex', () => {
    it('should format', () => {
        expect(regexFormater(null)).toBe('');
        expect(regexFormater('')).toBe('');
        expect(regexFormater('12')).toBe('12');
    });
    it('should parse', () => {
        expect(regexParser(null)).toEqual([null, false]);
        expect(regexParser('')).toEqual(['', false]);
        expect(regexParser('123-456')).toEqual(['123-456', true]);
    });
    it('should parse: pattern', () => {
        let param = { pattern: /^((0[1-9])|(1[0-2]))[\/-](([0-2][0-9])|([3][0-1]))$/ };
        expect(regexParser('2017-01-01', param)).toEqual(['2017-01-01', false]);
        expect(regexParser('09-12', param)).toEqual(['09-12', true]);
    });
});