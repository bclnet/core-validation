using System;
using Xunit;
using static CoreValidation.Formats.Moment;
using static CoreValidation.Globals;
using static System.DateTime;

namespace CoreValidation.Tests
{
  public class FormatMomentTest
  {
    [Fact]
    public void Date()
    {
      // should format
      {
        Assert2.Equal(DateFormatter(null), NulFormat);
        Assert2.Equal(DateFormatter(""), NulFormat);
        Assert2.Equal(DateFormatter("1/1/2017"), "2017-01-01");
        Assert2.Equal(DateFormatter("2017-01-01"), "2017-01-01");
        Assert2.Equal(DateFormatter("2017-01-01 03:00"), "2017-01-01");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => DateFormatter("2017-01-01", param));
      }
      // should format: date
      {
        var param = new { format = "date" }.ToParam();
        Assert2.Equal(DateFormatter("2017-01-01", param), "01 January 2017");
      }
      // should format: longDate
      {
        var param = new { format = "longDate" }.ToParam();
        Assert2.Equal(DateFormatter("2017-01-01", param), "Sunday, January 1, 2017");
      }
      // should format: longDate2
      {
        var param = new { format = "longDate2" }.ToParam();
        var firstOfYear = new DateTime(Today.Year, 1, 1);
        var firstOfYearFormat = firstOfYear.ToString("dddd, MMMM d");
        Assert2.Equal(DateFormatter(firstOfYear, param), firstOfYearFormat);
      }
      // should format: longDate2
      {
        var param = new { format = "longDate2" }.ToParam();
        Assert2.Equal(DateFormatter("2013-01-01", param), "Tuesday, January 1, 2013");
      }
      // should format: shortDate
      {
        var param = new { format = "shortDate" }.ToParam();
        Assert2.Equal(DateFormatter("2017-01-01", param), "1-Jan-2017");
      }
      // should format: shorterDate
      {
        var param = new { format = "shorterDate" }.ToParam();
        Assert2.Equal(DateFormatter("2017-01-01", param), "Jan 1 2017");
      }
      // should format: monthDay
      {
        var param = new { format = "monthDay" }.ToParam();
        Assert2.Equal(DateFormatter("2017-01-01", param), "January 1");
      }
      // should format: monthYear
      {
        var param = new { format = "monthYear" }.ToParam();
        Assert2.Equal(DateFormatter("2017-01-01", param), "January 2017");
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "yyyy" }.ToParam();
        Assert2.Equal(DateFormatter("2017-01-01", param), "2017");
      }
      // should parse
      {
        Assert2.Equal(DateParser(null), (null, true, null));
        Assert2.Equal(DateParser(""), ("", true, null));
        Assert2.Equal(DateParser("1ab"), ("1ab", false, null));
        Assert2.Equal(Assert2.ToString(DateParser("blah")), "blah,false,");
        Assert2.Equal(Assert2.ToString(DateParser("3:00 pm")), $"{Today},true,"); // "3:00 pm,false,"
        Assert2.Equal(Assert2.ToString(DateParser("2012-01-01 3pm")), "1/1/2012 12:00:00 AM,true,"); // "2012-01-01 3pm,false,"
        Assert2.Equal(Assert2.ToString(DateParser("1/1/2012")), "1/1/2012 12:00:00 AM,true,");
        Assert2.Equal(Assert2.ToString(DateParser("2012-01-01")), "1/1/2012 12:00:00 AM,true,");
        Assert2.Equal(Assert2.ToString(DateParser("2012-01-01 3:00 pm")), "1/1/2012 12:00:00 AM,true,");
        Assert2.Equal(Assert2.ToString(DateParser("1901-01-01 03:00:00 am")), "1/1/1901 12:00:00 AM,true,");
        // bounds-check
        Assert2.Equal(Assert2.ToString(DateParser("1752-01-01")), "1752-01-01,false,");
        Assert2.Equal(Assert2.ToString(DateParser("9999-01-01")), "9999-01-01,false,");
      }
      // should parse: minValue
      {
        Assert2.Equal(Assert2.ToString(DateParser("2011-01-01", (new { minValue = Parse("2012-01-01") }).ToParam())), "2011-01-01,false,");
        Assert2.Equal(Assert2.ToString(DateParser("2012-01-01", (new { minValue = Parse("1/1/2011") }).ToParam())), "1/1/2012 12:00:00 AM,true,");
      }
      // should parse: maxValue
      {
        Assert2.Equal(Assert2.ToString(DateParser("2017-01-01", (new { maxValue = Parse("2012-01-01") }).ToParam())), "2017-01-01,false,");
        Assert2.Equal(Assert2.ToString(DateParser("2011-01-01", (new { maxValue = Parse("1/1/2012") }).ToParam())), "1/1/2011 12:00:00 AM,true,");
      }
    }

    [Fact]
    public void DateTime()
    {
      // should format
      {
        Assert2.Equal(DateTimeFormatter(null), NulFormat);
        Assert2.Equal(DateTimeFormatter(""), NulFormat);
        Assert2.Equal(DateTimeFormatter("1/1/2017"), "2017-01-01 12:00 AM");
        Assert2.Equal(DateTimeFormatter("2017-03-02"), "2017-03-02 12:00 AM");
        Assert2.Equal(DateTimeFormatter("2017-01-01 03:00"), "2017-01-01 3:00 AM");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => DateTimeFormatter("2017-01-01 03:00 am", param));
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "yyyy" }.ToParam();
        Assert2.Equal(DateTimeFormatter("2017-01-01", param), "2017");
      }
      /// should format: dateTime
      {
        var param = new { format = "dateTime" }.ToParam();
        Assert2.Equal(DateTimeFormatter("2017-01-01 03:00 am", param), "01 January 2017 3:00 AM");
      }
      // should format: longDateTime
      {
        var param = new { format = "longDateTime" }.ToParam();
        Assert2.Equal(DateTimeFormatter("2017-01-01 03:00 AM", param), "Sunday, January 1, 2017 3:00 AM");
      }
      // should format: longDate
      {
        var param = new { format = "longDate" }.ToParam();
        Assert2.Equal(DateTimeFormatter("2017-01-01", param), "Sunday, January 1, 2017");
      }
      // should format: longTime
      {
        var param = new { format = "longTime" }.ToParam();
        Assert2.Equal(DateTimeFormatter("2017-01-01 03:00:00 am", param), "03:00:00 AM");
      }
      // should format: shortDate
      {
        var param = new { format = "shortDate" }.ToParam();
        Assert2.Equal(DateTimeFormatter("2017-01-01", param), "1-Jan-2017");
      }
      // should format: shorterDate
      {
        var param = new { format = "shorterDate" }.ToParam();
        Assert2.Equal(DateTimeFormatter("2017-01-01", param), "Jan 1 2017");
      }
      // should format: shortTime
      {
        var param = new { format = "shortTime" }.ToParam();
        Assert2.Equal(DateTimeFormatter("2017-01-01 03:00:00 am", param), "3:00 AM");
      }
      // should format: tinyDate
      {
        var param = new { format = "tinyDate" }.ToParam();
        Assert2.Equal(DateTimeFormatter("2017-01-01 03:00:00 am", param), "1/1/17");
      }
      // should format: tinyDateTime
      {
        var param = new { format = "tinyDateTime" }.ToParam();
        Assert2.Equal(DateTimeFormatter("2017-01-01 03:00:00 am", param), "1/1/17 3:00 AM");
      }
      // should parse
      {
        Assert2.Equal(DateTimeParser(null), (null, true, null));
        Assert2.Equal(DateTimeParser(""), ("", true, null));
        Assert2.Equal(DateTimeParser("1ab"), ("1ab", false, null));
        Assert2.Equal(Assert2.ToString(DateTimeParser("blah")), "blah,false,");
        Assert2.Equal(Assert2.ToString(DateTimeParser("2017-01-01 03:00:00 am")), "1/1/2017 3:00:00 AM,true,");
        Assert2.Equal(Assert2.ToString(DateTimeParser("1901-01-01 03:00:00 am")), "1/1/1901 3:00:00 AM,true,");
      }
      // should parse: minValue
      {
        Assert2.Equal(Assert2.ToString(DateTimeParser("2011-01-01", (new { minValue = Parse("2012-01-01") }).ToParam())), "2011-01-01,false,");
        Assert2.Equal(Assert2.ToString(DateTimeParser("2012-01-01", (new { minValue = Parse("1/1/2011") }).ToParam())), "1/1/2012 12:00:00 AM,true,");
      }
      // should parse: maxValue
      {
        Assert2.Equal(Assert2.ToString(DateTimeParser("2017-01-01", (new { maxValue = Parse("2012-01-01") }).ToParam())), "2017-01-01,false,");
        Assert2.Equal(Assert2.ToString(DateTimeParser("2011-01-01", (new { maxValue = Parse("1/1/2012") }).ToParam())), "1/1/2011 12:00:00 AM,true,");
      }
    }

    [Fact]
    public void MonthAndDay()
    {
      // should format
      {
        Assert2.Equal(MonthAndDayFormatter(null), NulFormat);
        Assert2.Equal(MonthAndDayFormatter(""), NulFormat);
        Assert2.Equal(MonthAndDayFormatter("1/1/2017"), "01/01");
        Assert2.Equal(MonthAndDayFormatter("2017-03-02"), "03/02");
        Assert2.Equal(MonthAndDayFormatter("2017-01-01 03:00"), "01/01");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => MonthAndDayFormatter("2017-01-01", param));
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "yyyy" }.ToParam();
        Assert2.Equal(MonthAndDayFormatter("2017-01-01", param), "2017");
      }
      // should parse
      {
        Assert2.Equal(MonthAndDayParser(null), (null, true, null));
        Assert2.Equal(MonthAndDayParser(""), ("", true, null));
        Assert2.Equal(MonthAndDayParser("1ab"), ("1ab", false, null));
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("blah")), "blah,false,");
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("31/12")), "31/12,false,");
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("12/40")), "12/40,false,");
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("12/31")), "12/31/2000 12:00:00 AM,true,");
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("12/31 3:00 pm")), "12/31 3:00 pm,false,");
        Assert2.Equal(Assert2.ToString(MonthAndDayParser("00/00")), "00/00,false,");
      }
    }

    [Fact]
    public void Time()
    {
      // should format
      {
        Assert2.Equal(TimeFormatter(null), NulFormat);
        Assert2.Equal(TimeFormatter(""), NulFormat);
        Assert2.Equal(TimeFormatter("1/1/2017"), "12:00 AM");
        Assert2.Equal(TimeFormatter("2017-01-01"), "12:00 AM");
        Assert2.Equal(TimeFormatter("2017-01-01 03:00"), "3:00 AM");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => TimeFormatter("2017-01-01", param));
      }
      // should format: longTime
      {
        var param = new { format = "longTime" }.ToParam();
        Assert2.Equal(TimeFormatter("2017-01-01", param), "12:00:00 AM");
      }
      // should format: shortTime
      {
        var param = new { format = "shortTime" }.ToParam();
        Assert2.Equal(TimeFormatter("2017-01-01 17:00", param), "5:00 PM");
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "hh tt" }.ToParam();
        Assert2.Equal(TimeFormatter("2017-01-01 17:00", param), "05 PM");
      }
      // should parse
      {
        Assert2.Equal(TimeParser(null), (null, true, null));
        Assert2.Equal(TimeParser(""), ("", true, null));
        Assert2.Equal(Assert2.ToString(TimeParser("1ab")), "1ab,false,");
        Assert2.Equal(Assert2.ToString(TimeParser("blah")), "blah,false,");
        Assert2.Equal(Assert2.ToString(TimeParser("3:00 pm")), "1/1/2000 3:00:00 PM,true,");
        Assert2.Equal(Assert2.ToString(TimeParser("2012-01-01 3:11:01 pm")), "1/1/2000 3:11:01 PM,true,");
        Assert2.Equal(Assert2.ToString(TimeParser("abc 3:00")), "abc 3:00,false,"); // "1/1/2000 3:00:00 AM,true,"
      }
      // should parse: minValue
      {
        Assert2.Equal(Assert2.ToString(TimeParser("2012-01-01 3:11:01 pm", (new { minValue = Parse("5:00:00 pm") }).ToParam())), "2012-01-01 3:11:01 pm,false,");
        Assert2.Equal(Assert2.ToString(TimeParser("2012-01-01 3:11:01 pm", (new { minValue = Parse("1:00:00 am") }).ToParam())), "1/1/2000 3:11:01 PM,true,");
      }
      // should parse: maxValue
      {
        Assert2.Equal(Assert2.ToString(TimeParser("2012-01-01 3:11:01 pm", (new { maxValue = Parse("1:00:00 am") }).ToParam())), "2012-01-01 3:11:01 pm,false,");
        Assert2.Equal(Assert2.ToString(TimeParser("2012-01-01 3:11:01 pm", (new { maxValue = Parse("5:00:00 pm") }).ToParam())), "1/1/2000 3:11:01 PM,true,");
      }
    }
  }
}
