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
        expect(dateFormater('2018-01-01', param)).toBe('Monday, January 1');
    });
    it('should format: longDate2', () => {
        let param = { format: 'longDate2' };
        expect(dateFormater('2013-01-01', param)).toBe('Tuesday, January 1, 2013');
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
        expect(dateParser(null)).toEqual([null, true, undefined]);
        expect(dateParser('')).toEqual(['', true, undefined]);
        expect(dateParser('1ab')).toEqual(['1ab', false, undefined]);
        expect(dateParser('blah').toString()).toEqual('blah,false,');
        expect(dateParser('3:00 pm').toString()).toEqual('3:00 pm,false,');
        expect(dateParser('2012-01-01 3pm').toString()).toEqual('2012-01-01 3pm,false,');
        expect(dateParser('1/1/2012').toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true,');
        expect(dateParser('2012-01-01').toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true,');
        expect(dateParser('2012-01-01 3:00 pm').toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true,');
        expect(dateParser('1901-01-01 03:00:00 am').toString()).toEqual('Tue Jan 01 1901 00:00:00 GMT-0600,true,');

    });
    it('should parse: minValue', () => {
        expect(dateParser('2011-01-01', { minValue: '2012-01-01' }).toString()).toEqual('Sat Jan 01 2011 00:00:00 GMT-0600,false,');
        expect(dateParser('2012-01-01', { minValue: '1/1/2011' }).toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true,');
    });
    it('should parse: maxValue', () => {
        expect(dateParser('2017-01-01', { maxValue: '2012-01-01' }).toString()).toEqual('Sun Jan 01 2017 00:00:00 GMT-0600,false,');
        expect(dateParser('2011-01-01', { maxValue: '1/1/2012' }).toString()).toEqual('Sat Jan 01 2011 00:00:00 GMT-0600,true,');
    });
});

describe('DateTime', () => {
    it('should format', () => {
        expect(dateTimeFormater(null)).toBe('');
        expect(dateTimeFormater('')).toBe('');
        expect(dateTimeFormater('1/1/2017')).toBe('01/01/2017');
        expect(dateTimeFormater('2017-03-02')).toBe('03/02/2017');
        expect(dateTimeFormater('2017-01-01 03:00')).toBe('01/01/2017');
    });
    it('should format: *', () => {
        let param = { format: '*' };
        expect(() => dateTimeFormater('2017-01-01 03:00 am', param)).toThrow();
    });
    it('should format: pattern', () => {
        let param = { format: 'pattern', pattern: 'YYYY' };
        expect(dateTimeFormater('2017-01-01', param)).toBe('2017');
    });
    it('should format: date', () => {
        let param = { format: 'date' };
        expect(dateTimeFormater('2017-01-01 03:00 am', param)).toBe('01 January 2017 03:00 am');
    });
    it('should format: longDateTime', () => {
        let param = { format: 'longDateTime' };
        expect(dateTimeFormater('2017-01-01 03:00 am', param)).toBe('Sunday, January 1, 2017 03:00 am');
    });
    it('should format: longDate', () => {
        let param = { format: 'longDate' };
        expect(dateTimeFormater('2017-01-01', param)).toBe('Sunday, January 1, 2017');
    });
    it('should format: longTime', () => {
        let param = { format: 'longTime' };
        expect(dateTimeFormater('2017-01-01 03:00:00 am', param)).toBe('03:00:00 am');
    });
    it('should format: shortDate', () => {
        let param = { format: 'shortDate' };
        expect(dateTimeFormater('2017-01-01', param)).toBe('1-Jan-2017');
    });
    it('should format: shorterDate', () => {
        let param = { format: 'shorterDate' };
        expect(dateTimeFormater('2017-01-01', param)).toBe('Jan 1 2017');
    });
    it('should format: shortTime', () => {
        let param = { format: 'shortTime' };
        expect(dateTimeFormater('2017-01-01 03:00:00 am', param)).toBe('03:00 am');
    });
    it('should format: tinyDate', () => {
        let param = { format: 'tinyDate' };
        expect(dateTimeFormater('2017-01-01 03:00:00 am', param)).toBe('1/1/17');
    });
    it('should format: tinyDateTime', () => {
        let param = { format: 'tinyDateTime' };
        expect(dateTimeFormater('2017-01-01 03:00:00 am', param)).toBe('1/1/17 03:00 am');
    });
    it('should parse', () => {
        expect(dateTimeParser(null)).toEqual([null, true, undefined]);
        expect(dateTimeParser('')).toEqual(['', true, undefined]);
        expect(dateTimeParser('1ab')).toEqual(['1ab', false, undefined]);
        expect(dateTimeParser('blah').toString()).toEqual('blah,false,');
        expect(dateTimeParser('2017-01-01 03:00:00 am').toString()).toEqual('Sun Jan 01 2017 00:00:00 GMT-0600,true,');
        expect(dateTimeParser('1901-01-01 03:00:00 am').toString()).toEqual('Tue Jan 01 1901 00:00:00 GMT-0600,true,');
    });
    it('should parse: minValue', () => {
        expect(dateTimeParser('2011-01-01', { minValue: '2012-01-01' }).toString()).toEqual('Sat Jan 01 2011 00:00:00 GMT-0600,false,');
        expect(dateTimeParser('2012-01-01', { minValue: '1/1/2011' }).toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true,');
    });
    it('should parse: maxValue', () => {
        expect(dateTimeParser('2017-01-01', { maxValue: '2012-01-01' }).toString()).toEqual('Sun Jan 01 2017 00:00:00 GMT-0600,false,');
        expect(dateTimeParser('2011-01-01', { maxValue: '1/1/2012' }).toString()).toEqual('Sat Jan 01 2011 00:00:00 GMT-0600,true,');
    });
});

describe('MonthAndDay', () => {
    it('should format', () => {
        expect(monthAndDayFormater(null)).toBe('');
        expect(monthAndDayFormater('')).toBe('');
        expect(monthAndDayFormater('1/1/2017')).toBe('01/01');
        expect(monthAndDayFormater('2017-03-02')).toBe('03/02');
        expect(monthAndDayFormater('2017-01-01 03:00')).toBe('01/01');
    });
    it('should format: *', () => {
        let param = { format: '*' };
        expect(() => monthAndDayFormater('2017-01-01', param)).toThrow();
    });
    it('should format: pattern', () => {
        let param = { format: 'pattern', pattern: 'YYYY' };
        expect(monthAndDayFormater('2017-01-01', param)).toBe('2017');
    });
    it('should parse', () => {
        expect(monthAndDayParser(null)).toEqual([null, true, undefined]);
        expect(monthAndDayParser('')).toEqual(['', true, undefined]);
        expect(monthAndDayParser('1ab')).toEqual(['1ab', false, undefined]);
        expect(monthAndDayParser('blah').toString()).toEqual('blah,false,');
        expect(monthAndDayParser('31/12').toString()).toEqual('31/12,false,');
        expect(monthAndDayParser('12/40').toString()).toEqual('12/40,false,');
        expect(monthAndDayParser('12/31').toString()).toEqual('Sun Dec 31 2000 00:00:00 GMT-0600,true,');
        expect(monthAndDayParser('12/31 3:00 pm').toString()).toEqual('12/31 3:00 pm,false,');
        expect(monthAndDayParser('00/00').toString()).toEqual('00/00,false,');
    });
});

describe('Time', () => {
    it('should format', () => {
        expect(timeFormater(null)).toBe('');
        expect(timeFormater('')).toBe('');
        expect(timeFormater('1/1/2017')).toEqual('12:00 00');
        expect(timeFormater('2017-01-01')).toEqual('12:00 00');
        expect(timeFormater('2017-01-01 03:00')).toEqual('03:00 00');
    });
    it('should format: *', () => {
        let param = { format: '*' };
        expect(() => timeFormater('2017-01-01', param)).toThrow();
    });
    it('should format: longTime', () => {
        let param = { format: 'longTime' };
        expect(timeFormater('2017-01-01', param)).toEqual('12:00:00 am');
    });
    it('should format: shortTime', () => {
        let param = { format: 'shortTime' };
        expect(timeFormater('2017-01-01 17:00', param)).toEqual('05:00 pm');
    });
    it('should format: pattern', () => {
        let param = { format: 'pattern', pattern: 'hh a' };
        expect(timeFormater('2017-01-01 17:00', param)).toEqual('05 pm');
    });
    it('should parse', () => {
        expect(timeParser(null)).toEqual([null, true, undefined]);
        expect(timeParser('')).toEqual(['', true, undefined]);
        expect(timeParser('1ab').toString()).toEqual('1ab,false,');
        expect(timeParser('blah').toString()).toEqual('blah,false,');
        expect(timeParser('3:00 pm').toString()).toEqual('Sat Jan 01 2000 15:00:00 GMT-0600,true,');
        expect(timeParser('2012-01-01 3:11:01 pm').toString()).toEqual('Sat Jan 01 2000 15:11:01 GMT-0600,true,');
    });
    it('should parse: minValue', () => {
        expect(timeParser('2012-01-01 3:11:01 pm', { minValue: '5:00:00 pm' }).toString()).toEqual('Sat Jan 01 2000 15:11:01 GMT-0600,false,');
        expect(timeParser('2012-01-01 3:11:01 pm', { minValue: '1:00:00 am' }).toString()).toEqual('Sat Jan 01 2000 15:11:01 GMT-0600,true,');
    });
    it('should parse: maxValue', () => {
        expect(timeParser('2012-01-01 3:11:01 pm', { maxValue: '1:00:00 am' }).toString()).toEqual('Sat Jan 01 2000 15:11:01 GMT-0600,false,');
        expect(timeParser('2012-01-01 3:11:01 pm', { maxValue: '5:00:00 pm' }).toString()).toEqual('Sat Jan 01 2000 15:11:01 GMT-0600,true,');
    });
});
