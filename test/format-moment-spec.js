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
        expect(dateParser('2011-01-01', { minValue: '2012-01-01' }).toString()).toEqual('Sat Jan 01 2011 00:00:00 GMT-0600,false');
        expect(dateParser('2012-01-01', { minValue: '1/1/2011' }).toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');

        //expect(dateParser('2013-01-01', { minValue: '1/1/2012' }).toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
    });
    it('should parse: maxValue', () => {
        expect(dateParser('2017-01-01', { maxValue: '2012-01-01' }).toString()).toEqual('Sun Jan 01 2017 00:00:00 GMT-0600,false');

        //expect(dateParser('2011-01-01', { minValue: '1/1/2012' }).toString()).toEqual('Sat Jan 01 2011 00:00:00 GMT-0600,true');
        //expect(dateParser('2012-01-01', { maxValue: '1/1/2012' }).toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
        //expect(dateParser('2013-01-01', { maxValue: '1/1/2012' }).toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
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
        expect(timeParser(null)).toEqual([null, false]);
        expect(timeParser('')).toEqual(['', false]);
        expect(timeParser('1ab')).toEqual(['1ab', false]);
        expect(timeParser('blah').toString()).toEqual('blah,false');
        expect(timeParser('3:00 pm').toString()).toEqual('3:00 pm,false');
        //expect(timeParser('3:10:03').toString()).toEqual(',false');
        // expect(timeParser('2012-01-01 3pm').toString()).toEqual('2012-01-01 3pm,false');
        // expect(timeParser('1/1/2012').toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
        // expect(timeParser('2012-01-01').toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
        // expect(timeParser('2012-01-01 3:00 pm').toString()).toEqual('Sun Jan 01 2012 00:00:00 GMT-0600,true');
    });
    // it('should parse: minValue', () => {
    //     expect(timeParser('2011-01-01', { minValue: '2012-01-01' }).toString()).toEqual('Sat Jan 01 2011 00:00:00 GMT-0600,false');
    // });
    // it('should parse: maxValue', () => {
    //     expect(timeParser('2017-01-01', { maxValue: '2012-01-01' }).toString()).toEqual('Sun Jan 01 2017 00:00:00 GMT-0600,false');
    // });
});
