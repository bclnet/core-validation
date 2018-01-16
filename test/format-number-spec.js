import assert from 'power-assert';

import {
    boolFormater, boolParser,
    decimalFormater, decimalParser,
    integerFormater, integerParser,
    realFormater, realParser,
    moneyFormater, moneyParser,
    percentFormater, percentParser,
} from '../src/formats/number';

describe('Bool', () => {
    it('should format', () => {
        expect(boolFormater(null)).toBe('No');
        expect(boolFormater('')).toBe('No');
        expect(boolFormater('12')).toBe('Yes');
    });
    it('should format: *', () => {
        let param = { format: '*' };
        expect(() => boolFormater('12', param)).toThrow();
    });
    it('should format: trueFalse', () => {
        let param = { format: 'trueFalse' };
        expect(boolFormater('12', param)).toBe('True');
        expect(boolFormater('', param)).toBe('False');
    });
    it('should format: yesNo', () => {
        let param = { format: 'yesNo' };
        expect(boolFormater('12', param)).toBe('Yes');
        expect(boolFormater('', param)).toBe('No');
    });
    it('should format: values no values', () => {
        let param = { format: 'values' };
        expect(() => boolFormater('12', param)).toThrow();
        expect(() => boolFormater('', param)).toThrow();
    });
    it('should format: values with values empty', () => {
        let param = { format: 'values', values: '' };
        expect(() => boolFormater('12', param)).toThrow();
    });
    it('should format: values with values null', () => {
        let param = { format: 'values', values: null };
        expect(() => boolFormater('1', param)).toThrow();
    });
    it('should format: values with values type string', () => {
        let param = { format: 'values', values: '1' };
        expect(() => boolFormater('s', param)).toThrow();
    });
    it('should format: values with values type empty array', () => {
        let param = { format: 'values', values: [] };
        expect(() => boolFormater('af', param)).toThrow();
    });
    it('should format: values with values array of length 1', () => {
        let param = { format: 'values', values: [1] };
        expect(() => boolFormater('af', param)).toThrow();
    });
    it('should format: values with values array of length 3', () => {
        let param = { format: 'values', values: [1, 2, 3] };
        expect(() => boolFormater('af', param)).toThrow();
    });
    it('should format: values with values array of length 2', () => {
        let param = { format: 'values', values: [1, 0] };
        expect(boolFormater('af', param)).toBe(1);
    });
    it('should format: values with no values array of length 2', () => {
        let param = { format: 'values', values: [1, 0] };
        expect(boolFormater('', param)).toBe(0);
    });
    it('should parse', () => {
        expect(boolParser(null)).toEqual([null, false]);
        expect(boolParser('')).toEqual(['', false]);
        expect(() => boolParser('A')).toThrow();
        expect(boolParser('Yes')).toEqual([true, true]);
        expect(boolParser('On')).toEqual([true, true]);
        expect(boolParser('true')).toEqual([true, true]);
        expect(boolParser('y')).toEqual([true, true]);
        expect(boolParser('1')).toEqual([true, true]);
        expect(boolParser('No')).toEqual([false, true]);
        expect(boolParser('Off')).toEqual([false, true]);
        expect(boolParser('false')).toEqual([false, true]);
        expect(boolParser('n')).toEqual([false, true]);
        expect(boolParser('0')).toEqual([false, true]);
    });
});

describe('Decimal', () => {
    it('should format', () => {
        expect(decimalFormater(null)).toBe('');
        expect(decimalFormater('')).toBe('');
        expect(decimalFormater('12')).toBe('12.0000');
        expect(decimalFormater('ABC')).toBe('NaN');
    });
    it('should format: *', () => {
        let param = { format: '*' };
        expect(() => decimalFormater('12', param)).toThrow();
    });
    it('should format: pattern', () => {
        let param = { format: 'pattern', pattern: '2' };
        expect(decimalFormater('12', param)).toBe('12.00');
    });
    it('should format: pattern', () => {
        let param = { format: 'pattern', pattern: 'A' };
        expect(decimalFormater('12', param)).toBe('12');
    });
    it('should parse', () => {
        expect(decimalParser(null)).toEqual([null, false]);
        expect(decimalParser('')).toEqual(['', false]);
        expect(decimalParser('NaN')).toEqual(['NaN', false]);
        expect(decimalParser('12')).toEqual([12, true]);
    });
    it('should parse: minValue less than', () => {
        let param = { minValue: '12' };
        expect(decimalParser('13.0', param)).toEqual([13, true]);
    });
    it('should parse: minValue greater than', () => {
        let param = { minValue: '13' };
        expect(decimalParser('12.0', param)).toEqual([12, false]);
    });
    it('should parse: maxValue greater than', () => {
        let param = { maxValue: '23' };
        expect(decimalParser('12.0', param)).toEqual([12, true]);
    });
    it('should parse: maxValue less than', () => {
        let param = { maxValue: '13' };
        expect(decimalParser('22.0', param)).toEqual([22, false]);
    });
    // it('should parse: precision', () => {
    //     let param = { precision: '2' };
    //     expect(decimalParser('22.123', param)).toEqual([22, true]);
    // });
    // it('should parse: round', () => {
    //     let param = { round: '13' };
    //     expect(decimalParser('22.0', param)).toEqual([22, false]);
    // });
});


describe('Integer', () => {
    it('should format', () => {
        expect(integerFormater(null)).toBe('');
        expect(integerFormater('')).toBe('');
        expect(integerFormater('A')).toBe('NaN');
        expect(integerFormater('12')).toBe('12');
    });
    it('should format: *', () => {
        let param = { format: '*' };
        expect(() => integerFormater('12', param)).toThrow();
    });
    it('should format: comma', () => {
        let param = { format: 'comma' };
        expect(integerFormater('1232323', param)).toBe('1,232,323');
    });
    it('should format: byte', () => {
        let param = { format: 'byte' };
        expect(integerFormater('1232323', param)).toBe('1 KB');
        expect(integerFormater('2', param)).toBe('2 bytes');
    });
    // it('should format: pattern', () => {
    //     let param = { format: 'pattern' };
    //     expect(integerFormater('1232323', param)).toBe('1,232,323');
    // });
    it('should parse', () => {
        expect(integerParser(null)).toEqual([null, false]);
        expect(integerParser('')).toEqual(['', false]);
        expect(integerParser('NaN')).toEqual(['NaN', false]);
        expect(integerParser('12')).toEqual([12, true]);
    });
    it('should parse: minValue less than', () => {
        let param = { minValue: '12' };
        expect(integerParser('13.0', param)).toEqual([13, true]);
    });
    it('should parse: minValue greater than', () => {
        let param = { minValue: '13' };
        expect(integerParser('12.0', param)).toEqual([12, false]);
    });
    it('should parse: maxValue greater than', () => {
        let param = { maxValue: '23' };
        expect(integerParser('12.0', param)).toEqual([12, true]);
    });
    it('should parse: maxValue less than', () => {
        let param = { maxValue: '13' };
        expect(integerParser('22.0', param)).toEqual([22, false]);
    });
});

describe('Real', () => {
    it('should', () => {
        assert(true);
    });
});

describe('Money', () => {
    it('should', () => {
        assert(true);
    });
});

describe('Percent', () => {
    it('should', () => {
        assert(true);
    });
});
