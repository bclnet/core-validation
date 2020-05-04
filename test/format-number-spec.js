import assert from 'power-assert';

import { nulFormat } from '../src/globals';
import {
    boolFormatter, boolParser,
    decimalFormatter, decimalParser,
    integerFormatter, integerParser,
    realFormatter, realParser,
    moneyFormatter, moneyParser,
    percentFormatter, percentParser,
} from '../src/formats/number';

describe('Bool', () => {
    it('should format', () => {
        expect(boolFormatter(null)).toBe(nulFormat);
        expect(boolFormatter('')).toBe(nulFormat);
        expect(boolFormatter('af')).toBe(nulFormat);
        expect(boolFormatter('0')).toBe('No');
        expect(boolFormatter('12')).toBe('Yes');
    });
    it('should format: *', () => {
        const param = { format: '*' };
        expect(() => boolFormatter('12', param)).toThrow();
    });
    it('should format: trueFalse', () => {
        const param = { format: 'trueFalse' };
        expect(boolFormatter('12', param)).toBe('True');
        expect(boolFormatter('0', param)).toBe('False');
    });
    it('should format: yesNo', () => {
        const param = { format: 'yesNo' };
        expect(boolFormatter('12', param)).toBe('Yes');
        expect(boolFormatter('0', param)).toBe('No');
    });
    it('should format: values', () => {
        const param = { format: 'values' };
        expect(() => boolFormatter('12', { format: 'values' })).toThrow();
        expect(() => boolFormatter('12', { format: 'values', values: '' })).toThrow();
        expect(() => boolFormatter('1', { format: 'values', values: null })).toThrow();
        expect(() => boolFormatter('1', { format: 'values', values: '1' })).toThrow();
        expect(() => boolFormatter('1', { format: 'values', values: [] })).toThrow();
        expect(() => boolFormatter('1', { format: 'values', values: ['1'] })).toThrow();
        expect(() => boolFormatter('1', { format: 'values', values: ['1', '2', '3'] })).toThrow();
        expect(boolFormatter('af', { format: 'values', values: ['1', '0'] })).toBe(nulFormat);
        expect(boolFormatter('12', { format: 'values', values: ['1', '0'] })).toBe('1');
        expect(boolFormatter('0', { format: 'values', values: ['1', '0'] })).toBe('0');
    });
    it('should parse', () => {
        expect(boolParser(null)).toEqual([null, true, undefined]);
        expect(boolParser('')).toEqual(['', true, undefined]);
        expect(boolParser('A')).toEqual(['A', false, undefined]);
        expect(boolParser('Yes')).toEqual([true, true, undefined]);
        expect(boolParser('On')).toEqual([true, true, undefined]);
        expect(boolParser('true')).toEqual([true, true, undefined]);
        expect(boolParser('y')).toEqual([true, true, undefined]);
        expect(boolParser('1')).toEqual([true, true, undefined]);
        expect(boolParser('No')).toEqual([false, true, undefined]);
        expect(boolParser('Off')).toEqual([false, true, undefined]);
        expect(boolParser('false')).toEqual([false, true, undefined]);
        expect(boolParser('n')).toEqual([false, true, undefined]);
        expect(boolParser('0')).toEqual([false, true, undefined]);
    });
});

describe('Decimal', () => {
    it('should format', () => {
        expect(decimalFormatter(null)).toBe(nulFormat);
        expect(decimalFormatter('')).toBe(nulFormat);
        expect(decimalFormatter('ABC')).toBe(nulFormat);
        expect(decimalFormatter('12')).toBe('12.0000');
    });
    it('should format: *', () => {
        expect(() => decimalFormatter('12', { format: '*' })).toThrow();
    });
    it('should format: comma', () => {
        expect(decimalFormatter(NaN, { format: 'comma' })).toBe(nulFormat);
        expect(decimalFormatter('1232323', { format: 'comma' })).toBe('1,232,323');
        expect(decimalFormatter('1232323.234', { format: 'comma' })).toBe('1,232,323.234');
        expect(decimalFormatter('12', { format: 'comma' })).toBe('12');
        expect(decimalFormatter('12.234', { format: 'comma' })).toBe('12.234');
    });
    it('should format: nx', () => {
        expect(decimalFormatter('12', { format: 'n2' })).toBe('12.00');
        expect(decimalFormatter('12', { format: 'n3' })).toBe('12.000');
    });
    it('should format: pattern', () => {
        expect(decimalFormatter('12', { format: 'pattern', pattern: '2' })).toBe('12.00');
        expect(decimalFormatter('12', { format: 'pattern', pattern: 'A' })).toBe('12');
    });
    it('should parse', () => {
        expect(decimalParser(null)).toEqual([null, true, undefined]);
        expect(decimalParser('')).toEqual(['', true, undefined]);
        expect(decimalParser('NaN')).toEqual(['NaN', false, undefined]);
        expect(decimalParser(NaN)).toEqual([NaN, true, undefined]);
        expect(decimalParser('12')).toEqual([12, true, undefined]);
    });
    it('should parse: minValue', () => {
        expect(decimalParser('13.0', { minValue: 12 })).toEqual([13, true, undefined]);
        expect(decimalParser('12.0', { minValue: 13 })).toEqual(['12.0', false, undefined]);
    });
    it('should parse: maxValue', () => {
        expect(decimalParser('12.0', { maxValue: 23 })).toEqual([12, true, undefined]);
        expect(decimalParser('22.0', { maxValue: 13 })).toEqual(['22.0', false, undefined]);
    });
    it('should parse: precision', () => {
        expect(decimalParser('22.123', { precision: 2 })).toEqual(['22.123', false, undefined]);
        expect(decimalParser('22.12', { precision: 2 })).toEqual([22.12, true, undefined]);
    });
    it('should parse: round', () => {
        expect(decimalParser('22.123', { round: 1 })).toEqual([22.1, true, undefined]);
        expect(decimalParser('22.123', { round: 2 })).toEqual([22.12, true, undefined]);
    });
});

describe('Integer', () => {
    it('should format', () => {
        expect(integerFormatter(null)).toBe(nulFormat);
        expect(integerFormatter('')).toBe(nulFormat);
        expect(integerFormatter('A')).toBe(nulFormat);
        expect(integerFormatter('12')).toBe('12');
    });
    it('should format: *', () => {
        expect(() => integerFormatter('12', { format: '*' })).toThrow();
    });
    it('should format: comma', () => {
        expect(integerFormatter(NaN, { format: 'comma' })).toBe(nulFormat);
        expect(integerFormatter('1232323', { format: 'comma' })).toBe('1,232,323');
        expect(integerFormatter('12', { format: 'comma' })).toBe('12');
    });
    it('should format: byte', () => {
        const param = { format: 'byte' };
        expect(integerFormatter('1232323', param)).toBe('1.18 MB');
        expect(integerFormatter('2048', param)).toBe('2 KB');
        expect(integerFormatter('2', param)).toBe('2 bytes');
        expect(integerFormatter('1', param)).toBe('1 byte');
        expect(integerFormatter('0', param)).toBe('0 bytes');
    });
    it('should format: pattern', () => {
        expect(integerFormatter('1232323', { format: 'pattern', pattern: 10 })).toBe('1232323');
    });
    it('should parse', () => {
        expect(integerParser(null)).toEqual([null, true, undefined]);
        expect(integerParser('')).toEqual(['', true, undefined]);
        expect(integerParser('NaN')).toEqual(['NaN', false, undefined]);
        expect(integerParser(NaN)).toEqual([NaN, true, undefined]);
        expect(integerParser('12')).toEqual([12, true, undefined]);
    });
    it('should parse: minValue', () => {
        expect(integerParser('13.0', { minValue: 12 })).toEqual([13, true, undefined]);
        expect(integerParser('12.0', { minValue: 13 })).toEqual(['12.0', false, undefined]);
    });
    it('should parse: maxValue', () => {
        expect(integerParser('12.0', { maxValue: 23 })).toEqual([12, true, undefined]);
        expect(integerParser('22.0', { maxValue: 13 })).toEqual(['22.0', false, undefined]);
    });
});

describe('Money', () => {
    it('should format', () => {
        expect(moneyFormatter(null)).toBe(nulFormat);
        expect(moneyFormatter('')).toBe(nulFormat);
        expect(moneyFormatter('A')).toBe(nulFormat);
        expect(moneyFormatter('12')).toBe('$12.00');
    });
    it('should format: *', () => {
        expect(() => moneyFormatter('12', { format: '*' })).toThrow();
    });
    it('should format: nx', () => {
        expect(moneyFormatter('12', { format: 'c2' })).toBe('$12.00');
        expect(moneyFormatter('12', { format: 'c3' })).toBe('$12.000');
    });
    it('should format: pattern', () => {
        expect(moneyFormatter('12', { format: 'pattern', pattern: '2' })).toBe('$12.00');
        expect(moneyFormatter('12', { format: 'pattern', pattern: 'A' })).toBe('$12.00');
    });
    it('should parse', () => {
        expect(moneyParser(null)).toEqual([null, true, undefined]);
        expect(moneyParser('')).toEqual(['', true, undefined]);
        expect(moneyParser('NaN')).toEqual(['', false, undefined]);
        expect(moneyParser(NaN)).toEqual([NaN, true, undefined]);
        expect(moneyParser('12')).toEqual([12, true, undefined]);
    });
    it('should parse: minValue', () => {
        expect(moneyParser('13.0', { minValue: 12 })).toEqual([13, true, undefined]);
        expect(moneyParser('12.0', { minValue: 13 })).toEqual(['12.0', false, undefined]);
    });
    it('should parse: maxValue', () => {
        expect(moneyParser('12.0', { maxValue: 23 })).toEqual([12, true, undefined]);
        expect(moneyParser('22.0', { maxValue: 13 })).toEqual(['22.0', false, undefined]);
    });
    it('should parse: precision', () => {
        expect(moneyParser('22.123', { precision: 2 })).toEqual(['22.123', false, undefined]);
        expect(moneyParser('22.12', { precision: 2 })).toEqual([22.12, true, undefined]);
    });
    it('should parse: round', () => {
        expect(moneyParser('22.123', { round: 1 })).toEqual([22.1, true, undefined]);
        expect(moneyParser('22.123', { round: 2 })).toEqual([22.12, true, undefined]);
    });
});

describe('Percent', () => {
    it('should format', () => {
        expect(percentFormatter(null)).toBe(nulFormat);
        expect(percentFormatter('')).toBe(nulFormat);
        expect(percentFormatter('A')).toBe(nulFormat);
        expect(percentFormatter('.12')).toBe('12.00%');
    });
    it('should format: *', () => {
        expect(() => percentFormatter('12', { format: '*' })).toThrow();
    });
    it('should format: nx', () => {
        expect(percentFormatter('.12', { format: 'p2' })).toBe('12.00%');
        expect(percentFormatter('.12', { format: 'p3' })).toBe('12.000%');
        expect(percentFormatter('.12', { format: 'p4' })).toBe('12.0000%');
    });
    it('should format: pattern', () => {
        expect(percentFormatter('.12', { format: 'pattern', pattern: '2' })).toBe('12.00%');
        expect(percentFormatter('.12', { format: 'pattern', pattern: 'A' })).toBe('12%');
    });
    it('should parse', () => {
        expect(percentParser(null)).toEqual([null, true, undefined]);
        expect(percentParser('')).toEqual(['', true, undefined]);
        expect(percentParser('NaN')).toEqual(['NaN', false, undefined]);
        expect(percentParser(NaN)).toEqual([NaN, true, undefined]);
        expect(percentParser('12')).toEqual([.12, true, undefined]);
        expect(percentParser('12%')).toEqual([.12, true, undefined]);
    });
});

describe('Real', () => {
    it('should format', () => {
        expect(realFormatter(null)).toBe(nulFormat);
        expect(realFormatter('')).toBe(nulFormat);
        expect(realFormatter('A')).toBe(nulFormat);
        expect(realFormatter('12')).toBe('12.0000');
    });
    it('should format: *', () => {
        expect(() => realFormatter('12', { format: '*' })).toThrow();
    });
    it('should format: comma', () => {
        expect(realFormatter(NaN, { format: 'comma' })).toBe(nulFormat);
        expect(realFormatter('1232323', { format: 'comma' })).toBe('1,232,323');
        expect(realFormatter('1232323.234', { format: 'comma' })).toBe('1,232,323.234');
        expect(realFormatter('12', { format: 'comma' })).toBe('12');
        expect(realFormatter('12.234', { format: 'comma' })).toBe('12.234');
    });
    it('should format: nx', () => {
        expect(realFormatter('12', { format: 'n2' })).toBe('12.00');
        expect(realFormatter('12', { format: 'n3' })).toBe('12.000');
    });
    it('should format: pattern', () => {
        expect(realFormatter('12', { format: 'pattern', pattern: '2' })).toBe('12.00');
        expect(realFormatter('12', { format: 'pattern', pattern: 'A' })).toBe('12');
    });
    it('should parse', () => {
        expect(realParser(null)).toEqual([null, true, undefined]);
        expect(realParser('')).toEqual(['', true, undefined]);
        expect(realParser('NaN')).toEqual(['NaN', false, undefined]);
        expect(realParser(NaN)).toEqual([NaN, true, undefined]);
        expect(realParser('12')).toEqual([12, true, undefined]);
    });
    it('should parse: minValue', () => {
        expect(realParser('13.0', { minValue: 12 })).toEqual([13, true, undefined]);
        expect(realParser('12.0', { minValue: 13 })).toEqual(['12.0', false, undefined]);
    });
    it('should parse: maxValue', () => {
        expect(realParser('12.0', { maxValue: 23 })).toEqual([12, true, undefined]);
        expect(realParser('22.0', { maxValue: 13 })).toEqual(['22.0', false, undefined]);
    });
    it('should parse: precision', () => {
        expect(realParser('22.123', { precision: 2 })).toEqual(['22.123', false, undefined]);
        expect(realParser('22.12', { precision: 2 })).toEqual([22.12, true, undefined]);
    });
    it('should parse: round', () => {
        expect(realParser('22.123', { round: 1 })).toEqual([22.1, true, undefined]);
        expect(realParser('22.123', { round: 2 })).toEqual([22.12, true, undefined]);
    });
});
