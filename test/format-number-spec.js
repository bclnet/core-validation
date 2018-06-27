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
        expect(() => boolFormater('12', { format: 'values', values: '' })).toThrow();
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
        expect(boolParser(null)).toEqual([null, true, undefined]);
        expect(boolParser('')).toEqual(['', true, undefined]);
        expect(() => boolParser('A')).toThrow();
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
        expect(decimalFormater(null)).toBe('');
        expect(decimalFormater('')).toBe('');
        expect(decimalFormater('12')).toBe('12.0000');
        expect(decimalFormater('ABC')).toBe('NaN');
    });
    it('should format: *', () => {
        expect(() => decimalFormater('12', { format: '*' })).toThrow();
    });
    it('should format: comma', () => {
        expect(decimalFormater(NaN, { format: 'comma' })).toBe('');
        expect(decimalFormater('1232323', { format: 'comma' })).toBe('1,232,323');
        expect(decimalFormater('1232323.234', { format: 'comma' })).toBe('1,232,323.234');
        expect(decimalFormater('12', { format: 'comma' })).toBe('12');
        expect(decimalFormater('12.234', { format: 'comma' })).toBe('12.234');
    });
    it('should format: nx', () => {
        expect(decimalFormater('12', { format: 'n2' })).toBe('12.00');
        expect(decimalFormater('12', { format: 'n3' })).toBe('12.000');
    });
    it('should format: pattern', () => {
        expect(decimalFormater('12', { format: 'pattern', pattern: '2' })).toBe('12.00');
        expect(decimalFormater('12', { format: 'pattern', pattern: 'A' })).toBe('12');
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
        expect(decimalParser('12.0', { minValue: 13 })).toEqual([12, false, undefined]);
    });
    it('should parse: maxValue', () => {
        expect(decimalParser('12.0', { maxValue: 23 })).toEqual([12, true, undefined]);
        expect(decimalParser('22.0', { maxValue: 13 })).toEqual([22, false, undefined]);
    });
    it('should parse: precision', () => {
        expect(decimalParser('22.123', { precision: 2 })).toEqual([22.123, false, undefined]);
        expect(decimalParser('22.12', { precision: 2 })).toEqual([22.12, true, undefined]);
    });
    it('should parse: round', () => {
        expect(decimalParser('22.123', { round: 1 })).toEqual([22.1, true, undefined]);
        expect(decimalParser('22.123', { round: 2 })).toEqual([22.12, true, undefined]);
    });
});

describe('Integer', () => {
    it('should format', () => {
        expect(integerFormater(null)).toBe('');
        expect(integerFormater('')).toBe('');
        expect(integerFormater('A')).toBe('NaN');
        expect(integerFormater('12')).toBe('12');
    });
    it('should format: *', () => {
        expect(() => integerFormater('12', { format: '*' })).toThrow();
    });
    it('should format: comma', () => {
        expect(integerFormater(NaN, { format: 'comma' })).toBe('');
        expect(integerFormater('1232323', { format: 'comma' })).toBe('1,232,323');
        expect(integerFormater('12', { format: 'comma' })).toBe('12');
    });
    it('should format: byte', () => {
        let param = { format: 'byte' };
        expect(integerFormater('1232323', param)).toBe('1.18 MB');
        expect(integerFormater('2048', param)).toBe('2 KB');
        expect(integerFormater('2', param)).toBe('2 bytes');
    });
    it('should format: pattern', () => {
        expect(integerFormater('1232323', { format: 'pattern', pattern: 10 })).toBe('1232323');
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
        expect(integerParser('12.0', { minValue: 13 })).toEqual([12, false, undefined]);
    });
    it('should parse: maxValue', () => {
        expect(integerParser('12.0', { maxValue: 23 })).toEqual([12, true, undefined]);
        expect(integerParser('22.0', { maxValue: 13 })).toEqual([22, false, undefined]);
    });
});

describe('Real', () => {
    it('should format', () => {
        expect(realFormater(null)).toBe('');
        expect(realFormater('')).toBe('');
        expect(realFormater('A')).toBe('NaN');
        expect(realFormater('12')).toBe('12.0000');
    });
    it('should format: *', () => {
        expect(() => realFormater('12', { format: '*' })).toThrow();
    });
    it('should format: comma', () => {
        expect(realFormater(NaN, { format: 'comma' })).toBe('');
        expect(realFormater('1232323', { format: 'comma' })).toBe('1,232,323');
        expect(realFormater('1232323.234', { format: 'comma' })).toBe('1,232,323.234');
        expect(realFormater('12', { format: 'comma' })).toBe('12');
        expect(realFormater('12.234', { format: 'comma' })).toBe('12.234');
    });
    it('should format: nx', () => {
        expect(realFormater('12', { format: 'n2' })).toBe('12.00');
        expect(realFormater('12', { format: 'n3' })).toBe('12.000');
    });
    it('should format: pattern', () => {
        expect(realFormater('12', { format: 'pattern', pattern: '2' })).toBe('12.00');
        expect(realFormater('12', { format: 'pattern', pattern: 'A' })).toBe('12');
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
        expect(realParser('12.0', { minValue: 13 })).toEqual([12, false, undefined]);
    });
    it('should parse: maxValue', () => {
        expect(realParser('12.0', { maxValue: 23 })).toEqual([12, true, undefined]);
        expect(realParser('22.0', { maxValue: 13 })).toEqual([22, false, undefined]);
    });
    it('should parse: precision', () => {
        expect(realParser('22.123', { precision: 2 })).toEqual([22.123, false, undefined]);
        expect(realParser('22.12', { precision: 2 })).toEqual([22.12, true, undefined]);
    });
    it('should parse: round', () => {
        expect(realParser('22.123', { round: 1 })).toEqual([22.1, true, undefined]);
        expect(realParser('22.123', { round: 2 })).toEqual([22.12, true, undefined]);
    });
});

describe('Money', () => {
    it('should format', () => {
        expect(moneyFormater(null)).toBe('');
        expect(moneyFormater('')).toBe('');
        expect(moneyFormater('A')).toBe('$0.00');
        expect(moneyFormater('12')).toBe('$12.00');
    });
    it('should format: *', () => {
        expect(() => moneyFormater('12', { format: '*' })).toThrow();
    });
    it('should format: nx', () => {
        expect(moneyFormater('12', { format: 'c2' })).toBe('$12.00');
        expect(moneyFormater('12', { format: 'c3' })).toBe('$12.000');
    });
    it('should format: pattern', () => {
        expect(moneyFormater('12', { format: 'pattern', pattern: '2' })).toBe('$12.00');
        expect(moneyFormater('12', { format: 'pattern', pattern: 'A' })).toBe('$12.00');
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
        expect(moneyParser('12.0', { minValue: 13 })).toEqual([12, false, undefined]);
    });
    it('should parse: maxValue', () => {
        expect(moneyParser('12.0', { maxValue: 23 })).toEqual([12, true, undefined]);
        expect(moneyParser('22.0', { maxValue: 13 })).toEqual([22, false, undefined]);
    });
    it('should parse: precision', () => {
        expect(moneyParser('22.123', { precision: 2 })).toEqual([22.123, false, undefined]);
        expect(moneyParser('22.12', { precision: 2 })).toEqual([22.12, true, undefined]);
    });
    it('should parse: round', () => {
        expect(moneyParser('22.123', { round: 1 })).toEqual([22.1, true, undefined]);
        expect(moneyParser('22.123', { round: 2 })).toEqual([22.12, true, undefined]);
    });
});

describe('Percent', () => {
    it('should format', () => {
        expect(percentFormater(null)).toBe('');
        expect(percentFormater('')).toBe('');
        expect(percentFormater('A')).toBe('NaN%');
        expect(percentFormater('.12')).toBe('12.00%');
    });
    it('should format: *', () => {
        expect(() => percentFormater('12', { format: '*' })).toThrow();
    });
    it('should format: nx', () => {
        expect(percentFormater('.12', { format: 'p2' })).toBe('12.00%');
        expect(percentFormater('.12', { format: 'p3' })).toBe('12.000%');
        expect(percentFormater('.12', { format: 'p4' })).toBe('12.0000%');
    });
    it('should format: pattern', () => {
        expect(percentFormater('.12', { format: 'pattern', pattern: '2' })).toBe('12.00%');
        expect(percentFormater('.12', { format: 'pattern', pattern: 'A' })).toBe('12%');
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
