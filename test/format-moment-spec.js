import assert from 'power-assert';
import moment from 'moment';

import {
    dateFormater, dateParser,
    dateTimeFormater, dateTimeParser,
    monthAndDayFormater, monthAndDayParser,
    timeFormater, timeParser,
} from '../src/formats/moment';

describe('Date', () => {
    it('should format', () => {
        expect(dateFormater(null)).toBe('');
        expect(dateFormater('')).toBe('');
        expect(dateFormater('1/1/2017')).toBe('2017-01-01');
        expect(dateFormater('2017-01-01')).toBe('2017-01-01');
        expect(dateFormater('2017-01-01 03:00')).toBe('2017-01-01');
    });
    it('should format: *', () => {
        let param = { format: '*' };
        expect(() => dateFormater('2017-01-01', param)).toThrow();
    });
    it('should format: date', () => {
        let param = { format: 'date' };
        expect(dateFormater('2017-01-01', param)).toBe('01 January 2017');
    });
    it('should format: longDate', () => {
        let param = { format: 'longDate' };
        expect(dateFormater('2017-01-01', param)).toBe('Sunday, January 1, 2017');
    });
    it('should format: longDate2', () => {
        let param = { format: 'longDate2' };
        expect(dateFormater('2017-01-01', param)).toBe('Sunday, January 1, 2017');
    });
    it('should format: shortDate', () => {
        let param = { format: 'shortDate' };
        expect(dateFormater('2017-01-01', param)).toBe('1-Jan-2017');
    });
    it('should format: shorterDate', () => {
        let param = { format: 'shorterDate' };
        expect(dateFormater('2017-01-01', param)).toBe('Jan 1 2017');
    });
    it('should format: monthDay', () => {
        let param = { format: 'monthDay' };
        expect(dateFormater('2017-01-01', param)).toBe('January 1');
    });
    it('should format: monthYear', () => {
        let param = { format: 'monthYear' };
        expect(dateFormater('2017-01-01', param)).toBe('January 2017');
    });
    it('should format: pattern', () => {
        let param = { format: 'pattern', pattern: 'YYYY' };
        expect(dateFormater('2017-01-01', param)).toBe('2017');
    });
    it('should parse', () => {
        expect(dateParser(null)).toEqual([null, false]);
        expect(dateParser('')).toEqual(['', false]);
        expect(dateParser('1ab')).toEqual(['1ab', false]);
        expect(dateParser('blah').toString()).toEqual('blah,false');
        expect(dateParser('3:00 pm').toString()).toEqual('3:00 pm,false');
        expect(dateParser('2012-01-01 3pm').toString()).toEqual('2012-01-01 3pm,false');
        expect(dateParser('1/1/2012').toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
        expect(dateParser('2012-01-01').toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
        expect(dateParser('2012-01-01 3:00 pm').toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
    });
    it('should parse: minValue', () => {
        expect(dateParser('2011-01-01', { minValue: '1/1/2012' }).toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
        expect(dateParser('2012-01-01', { minValue: '1/1/2012' }).toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
        expect(dateParser('2013-01-01', { minValue: '1/1/2012' }).toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
    });
    it('should parse: maxValue', () => {
        expect(dateParser('2011-01-01', { minValue: '1/1/2012' }).toString()).toEqual('Sat Jan 01 2011 00:00:00 GMT-0600,true');
        expect(dateParser('2012-01-01', { maxValue: '1/1/2012' }).toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
        expect(dateParser('2013-01-01', { maxValue: '1/1/2012' }).toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
    });
});

describe('DateTime', () => {
    it('should', () => {
        assert(true);
    });
});

describe('MonthAndDay', () => {
    it('should', () => {
        assert(true);
    });
});

describe('Time', () => {
    it('should', () => {
        assert(true);
    });
});
