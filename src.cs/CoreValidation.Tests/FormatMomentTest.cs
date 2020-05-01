using System;
using Xunit;
using static CoreValidation.Formats.Moment;
using static CoreValidation.Globals;

namespace CoreValidation.Tests
{
  public class FormatMomentTest
  {
    [Fact]
    public void Date()
    {
      // should format
      {
        Assert2.Equal(DateFormater(null), NulFormat);
        Assert2.Equal(DateFormater(""), NulFormat);
        Assert2.Equal(DateFormater("1/1/2017"), "2017-01-01");
        Assert2.Equal(DateFormater("2017-01-01"), "2017-01-01");
        Assert2.Equal(DateFormater("2017-01-01 03:00"), "2017-01-01");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => DateFormater("2017-01-01", param));
      }
      // should format: date
      {
        var param = new { format = "date" }.ToParam();
        Assert2.Equal(DateFormater("2017-01-01", param), "01 January 2017");
      }
      // should format: longDate
      {
        var param = new { format = "longDate" }.ToParam();
        Assert2.Equal(DateFormater("2017-01-01", param), "Sunday, January 1, 2017");
      }
      // should format: longDate2
      {
        var param = new { format = "longDate2" }.ToParam();
        var firstOfYear = new DateTime(System.DateTime.Today.Year, 1, 1);
        var firstOfYearFormat = firstOfYear.ToString("dddd, MMMM D");
        Assert2.Equal(DateFormater(firstOfYear, param), firstOfYearFormat);
      }
      // should format: longDate2
      {
        var param = new { format = "longDate2" }.ToParam();
        Assert2.Equal(DateFormater("2013-01-01", param), "Tuesday, January 1, 2013");
      }
      // should format: shortDate
      {
        var param = new { format = "shortDate" }.ToParam();
        Assert2.Equal(DateFormater("2017-01-01", param), "1-Jan-2017");
      }
      // should format: shorterDate
      {
        var param = new { format = "shorterDate" }.ToParam();
        Assert2.Equal(DateFormater("2017-01-01", param), "Jan 1 2017");
      }
      // should format: monthDay
      {
        var param = new { format = "monthDay" }.ToParam();
        Assert2.Equal(DateFormater("2017-01-01", param), "January 1");
      }
      // should format: monthYear
      {
        var param = new { format = "monthYear" }.ToParam();
        Assert2.Equal(DateFormater("2017-01-01", param), "January 2017");
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "YYYY" }.ToParam();
        Assert2.Equal(DateFormater("2017-01-01", param), "2017");
      }
      // should parse
      {
        Assert2.Equal(DateParser(null), (null, true, null));
        Assert2.Equal(DateParser(""), ("", true, null));
        Assert2.Equal(DateParser("1ab"), ("1ab", false, null));
        Assert2.Equal(Assert2.ToString(DateParser("blah")), "blah,false,");
        Assert2.Equal(Assert2.ToString(DateParser("3:00 pm")), "3:00 pm,false,");
        Assert2.Equal(Assert2.ToString(DateParser("2012-01-01 3pm")), "2012-01-01 3pm,false,");
        Assert2.Equal(Assert2.ToString(DateParser("1/1/2012")), "Sun Jan 01 2012 00:00:00 GMT-0600,true,");
        Assert2.Equal(Assert2.ToString(DateParser("2012-01-01")), "Sun Jan 01 2012 00:00:00 GMT-0600,true,");
        Assert2.Equal(Assert2.ToString(DateParser("2012-01-01 3:00 pm")), "Sun Jan 01 2012 00:00:00 GMT-0600,true,");
        Assert2.Equal(Assert2.ToString(DateParser("1901-01-01 03:00:00 am")), "Tue Jan 01 1901 00:00:00 GMT-0600,true,");
        // bounds-check
        Assert2.Equal(Assert2.ToString(DateParser("1752-01-01")), "Sat Jan 01 1752 00:00:00 GMT-0545,false,");
        Assert2.Equal(Assert2.ToString(DateParser("10000-01-01")), "Sat Jan 01 10000 00:00:00 GMT-0600,true,");
      }
      // should parse: minValue
      {
        Assert2.Equal(Assert2.ToString(DateParser("2011-01-01", (new { minValue = "2012-01-01" }).ToParam())), "Sat Jan 01 2011 00:00:00 GMT-0600,false,");
        Assert2.Equal(Assert2.ToString(DateParser("2012-01-01", (new { minValue = "1/1/2011" }).ToParam())), "Sun Jan 01 2012 00:00:00 GMT-0600,true,");
      }
      // should parse: maxValue
      {
        Assert2.Equal(Assert2.ToString(DateParser("2017-01-01", (new { maxValue = "2012-01-01" }).ToParam())), "Sun Jan 01 2017 00:00:00 GMT-0600,false,");
        Assert2.Equal(Assert2.ToString(DateParser("2011-01-01", (new { maxValue = "1/1/2012" }).ToParam())), "Sat Jan 01 2011 00:00:00 GMT-0600,true,");
      }
    }

    [Fact]
    public void DateTime()
    {
      // should format
      {
        Assert2.Equal(DateTimeFormater(null), NulFormat);
        Assert2.Equal(DateTimeFormater(""), NulFormat);
        Assert2.Equal(DateTimeFormater("1/1/2017"), "01/01/2017");
        Assert2.Equal(DateTimeFormater("2017-03-02"), "03/02/2017");
        Assert2.Equal(DateTimeFormater("2017-01-01 03:00"), "01/01/2017");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => DateTimeFormater("2017-01-01 03:00 am", param));
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "YYYY" }.ToParam();
        Assert2.Equal(DateTimeFormater("2017-01-01", param), "2017");
      }
      /// should format: dateTime
      {
        var param = new { format = "dateTime" }.ToParam();
        Assert2.Equal(DateTimeFormater("2017-01-01 03:00 am", param), "01 January 2017 03:00 am");
      }
      // should format: longDateTime
      {
        var param = new { format = "longDateTime" }.ToParam();
        Assert2.Equal(DateTimeFormater("2017-01-01 03:00 am", param), "Sunday, January 1, 2017 03:00 am");
      }
      // should format: longDate
      {
        var param = new { format = "longDate" }.ToParam();
        Assert2.Equal(DateTimeFormater("2017-01-01", param), "Sunday, January 1, 2017");
      }
      // should format: longTime
      {
        var param = new { format = "longTime" }.ToParam();
        Assert2.Equal(DateTimeFormater("2017-01-01 03:00:00 am", param), "03:00:00 am");
      }
      // should format: shortDate
      {
        var param = new { format = "shortDate" }.ToParam();
        Assert2.Equal(DateTimeFormater("2017-01-01", param), "1-Jan-2017");
      }
      // should format: shorterDate
      {
        var param = new { format = "shorterDate" }.ToParam();
        Assert2.Equal(DateTimeFormater("2017-01-01", param), "Jan 1 2017");
      }
      // should format: shortTime
      {
        var param = new { format = "shortTime" }.ToParam();
        Assert2.Equal(DateTimeFormater("2017-01-01 03:00:00 am", param), "03:00 am");
      }
      // should format: tinyDate
      {
        var param = new { format = "tinyDate" }.ToParam();
        Assert2.Equal(DateTimeFormater("2017-01-01 03:00:00 am", param), "1/1/17");
      }
      // should format: tinyDateTime
      {
        var param = new { format = "tinyDateTime" }.ToParam();
        Assert2.Equal(DateTimeFormater("2017-01-01 03:00:00 am", param), "1/1/17 03:00 am");
      }
      // should parse
      {
        Assert2.Equal(DateTimeParser(null), (null, true, null));
        Assert2.Equal(DateTimeParser(""), ("", true, null));
        Assert2.Equal(DateTimeParser("1ab"), ("1ab", false, null));
        Assert2.Equal(Assert2.ToString(DateTimeParser("blah")), "blah,false,");
        Assert2.Equal(Assert2.ToString(DateTimeParser("2017-01-01 03:00:00 am")), "Sun Jan 01 2017 03:00:00 GMT-0600,true,");
        Assert2.Equal(Assert2.ToString(DateTimeParser("1901-01-01 03:00:00 am")), "Tue Jan 01 1901 03:00:00 GMT-0600,true,");
      }
      // should parse: minValue
      {
        Assert2.Equal(Assert2.ToString(DateTimeParser("2011-01-01", (new { minValue = "2012-01-01" }).ToParam())), "Sat Jan 01 2011 00:00:00 GMT-0600,false,");
        Assert2.Equal(Assert2.ToString(DateTimeParser("2012-01-01", (new { minValue = "1/1/2011" }).ToParam())), "Sun Jan 01 2012 00:00:00 GMT-0600,true,");
      }
      // should parse: maxValue
      {
        Assert2.Equal(Assert2.ToString(DateTimeParser("2017-01-01", (new { maxValue = "2012-01-01" }).ToParam())), "Sun Jan 01 2017 00:00:00 GMT-0600,false,");
        Assert2.Equal(Assert2.ToString(DateTimeParser("2011-01-01", (new { maxValue = "1/1/2012" }).ToParam())), "Sat Jan 01 2011 00:00:00 GMT-0600,true,");
      }
    }

    [Fact]
    public void MonthAndDay()
    {
      // should format
      {
        Assert2.Equal(MonthAndDayFormater(null), NulFormat);
        Assert2.Equal(MonthAndDayFormater(""), NulFormat);
        Assert2.Equal(MonthAndDayFormater("1/1/2017"), "01/01");
        Assert2.Equal(MonthAndDayFormater("2017-03-02"), "03/02");
        Assert2.Equal(MonthAndDayFormater("2017-01-01 03:00"), "01/01");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => MonthAndDayFormater("2017-01-01", param));
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "YYYY" }.ToParam();
        Assert2.Equal(MonthAndDayFormater("2017-01-01", param), "2017");
      }
      // should parse
      {
        Assert2.Equal(MonthAndDayParser(null), (null, true, null));
        Assert2.Equal(MonthAndDayParser(""), ("", true, null));
        Assert2.Equal(MonthAndDayParser("1ab"), ("1ab", false, null));
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("blah")), "blah,false,");
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("31/12")), "31/12,false,");
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("12/40")), "12/40,false,");
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("12/31")), "Sun Dec 31 2000 00:00:00 GMT-0600,true,");
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("12/31 3:00 pm")), "12/31 3:00 pm,false,");
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("00/00")), "00/00,false,");
      }
    }

    [Fact]
    public void Time()
    {
      // should format
      {
        Assert2.Equal(TimeFormater(null), NulFormat);
        Assert2.Equal(TimeFormater(""), NulFormat);
        Assert2.Equal(TimeFormater("1/1/2017"), "12:00 00");
        Assert2.Equal(TimeFormater("2017-01-01"), "12:00 00");
        Assert2.Equal(TimeFormater("2017-01-01 03:00"), "03:00 00");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => TimeFormater("2017-01-01", param));
      }
      // should format: longTime
      {
        var param = new { format = "longTime" }.ToParam();
        Assert2.Equal(TimeFormater("2017-01-01", param), "12:00:00 am");
      }
      // should format: shortTime
      {
        var param = new { format = "shortTime" }.ToParam();
        Assert2.Equal(TimeFormater("2017-01-01 17:00", param), "05:00 pm");
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "hh a" }.ToParam();
        Assert2.Equal(TimeFormater("2017-01-01 17:00", param), "05 pm");
      }
      // should parse
      {
        Assert2.Equal(TimeParser(null), (null, true, null));
        Assert2.Equal(TimeParser(""), ("", true, null));
        Assert2.Equal(Assert2.ToString(TimeParser("1ab")), "1ab,false,");
        Assert2.Equal(Assert2.ToString(TimeParser("blah")), "blah,false,");
        Assert2.Equal(Assert2.ToString(TimeParser("3:00 pm")), "Sat Jan 01 2000 15:00:00 GMT-0600,true,");
        Assert2.Equal(Assert2.ToString(TimeParser("2012-01-01 3:11:01 pm")), "Sat Jan 01 2000 15:11:01 GMT-0600,true,");
        Assert2.Equal(Assert2.ToString(TimeParser("abc 3:00")), "Sat Jan 01 2000 03:00:00 GMT-0600,true,");
      }
      // should parse: minValue
      {
        Assert2.Equal(Assert2.ToString(TimeParser("2012-01-01 3:11:01 pm", (new { minValue = "5:00:00 pm" }).ToParam())), "Sat Jan 01 2000 15:11:01 GMT-0600,false,");
        Assert2.Equal(Assert2.ToString(TimeParser("2012-01-01 3:11:01 pm", (new { minValue = "1:00:00 am" }).ToParam())), "Sat Jan 01 2000 15:11:01 GMT-0600,true,");
      }
      // should parse: maxValue
      {
        Assert2.Equal(Assert2.ToString(TimeParser("2012-01-01 3:11:01 pm", (new { maxValue = "1:00:00 am" }).ToParam())), "Sat Jan 01 2000 15:11:01 GMT-0600,false,");
        Assert2.Equal(Assert2.ToString(TimeParser("2012-01-01 3:11:01 pm", (new { maxValue = "5:00:00 pm" }).ToParam())), "Sat Jan 01 2000 15:11:01 GMT-0600,true,");
      }
    }
  }
}
