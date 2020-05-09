using Shouldly;
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
        DateFormatter(null).ShouldBe(NulFormat);
        DateFormatter("").ShouldBe(NulFormat);
        DateFormatter("1/1/2017").ShouldBe("2017-01-01");
        DateFormatter("2017-01-01").ShouldBe("2017-01-01");
        DateFormatter("2017-01-01 03:00").ShouldBe("2017-01-01");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => DateFormatter("2017-01-01", param));
      }
      // should format: date
      {
        var param = new { format = "date" }.ToParam();
        DateFormatter("2017-01-01", param).ShouldBe("01 January 2017");
      }
      // should format: longDate
      {
        var param = new { format = "longDate" }.ToParam();
        DateFormatter("2017-01-01", param).ShouldBe("Sunday, January 1, 2017");
      }
      // should format: longDate2
      {
        var param = new { format = "longDate2" }.ToParam();
        var firstOfYear = new DateTime(Today.Year, 1, 1);
        var firstOfYearFormat = firstOfYear.ToString("dddd, MMMM d");
        DateFormatter(firstOfYear, param).ShouldBe(firstOfYearFormat);
      }
      // should format: longDate2
      {
        var param = new { format = "longDate2" }.ToParam();
        DateFormatter("2013-01-01", param).ShouldBe("Tuesday, January 1, 2013");
      }
      // should format: shortDate
      {
        var param = new { format = "shortDate" }.ToParam();
        DateFormatter("2017-01-01", param).ShouldBe("1-Jan-2017");
      }
      // should format: shorterDate
      {
        var param = new { format = "shorterDate" }.ToParam();
        DateFormatter("2017-01-01", param).ShouldBe("Jan 1 2017");
      }
      // should format: monthDay
      {
        var param = new { format = "monthDay" }.ToParam();
        DateFormatter("2017-01-01", param).ShouldBe("January 1");
      }
      // should format: monthYear
      {
        var param = new { format = "monthYear" }.ToParam();
        DateFormatter("2017-01-01", param).ShouldBe("January 2017");
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "yyyy" }.ToParam();
        DateFormatter("2017-01-01", param).ShouldBe("2017");
      }
      // should parse
      {
        DateParser(null).ShouldBe((null, true, null));
        DateParser("").ShouldBe(("", true, null));
        DateParser("1ab").ShouldBe(("1ab", false, null));
        DateParser("blah").ToBlob().ShouldBe("blah,false,");
        DateParser("3:00 pm").ToBlob().ShouldBe($"{Today},true,"); // "3:00 pm,false,"
        DateParser("2012-01-01 3pm").ToBlob().ShouldBe("1/1/2012 12:00:00 AM,true,"); // "2012-01-01 3pm,false,"
        DateParser("1/1/2012").ToBlob().ShouldBe("1/1/2012 12:00:00 AM,true,");
        DateParser("2012-01-01").ToBlob().ShouldBe("1/1/2012 12:00:00 AM,true,");
        DateParser("2012-01-01 3:00 pm").ToBlob().ShouldBe("1/1/2012 12:00:00 AM,true,");
        DateParser("1901-01-01 03:00:00 am").ToBlob().ShouldBe("1/1/1901 12:00:00 AM,true,");
        // bounds-check
        DateParser("1752-01-01").ToBlob().ShouldBe("1752-01-01,false,");
        DateParser("9999-01-01").ToBlob().ShouldBe("9999-01-01,false,");
      }
      // should parse: minValue
      {
        DateParser("2011-01-01", (new { minValue = Parse("2012-01-01") }).ToParam()).ToBlob().ShouldBe("2011-01-01,false,");
        DateParser("2012-01-01", (new { minValue = Parse("1/1/2011") }).ToParam()).ToBlob().ShouldBe("1/1/2012 12:00:00 AM,true,");
      }
      // should parse: maxValue
      {
        DateParser("2017-01-01", (new { maxValue = Parse("2012-01-01") }).ToParam()).ToBlob().ShouldBe("2017-01-01,false,");
        DateParser("2011-01-01", (new { maxValue = Parse("1/1/2012") }).ToParam()).ToBlob().ShouldBe("1/1/2011 12:00:00 AM,true,");
      }
    }

    [Fact]
    public void DateTime()
    {
      // should format
      {
        DateTimeFormatter(null).ShouldBe(NulFormat);
        DateTimeFormatter("").ShouldBe(NulFormat);
        DateTimeFormatter("1/1/2017").ShouldBe("2017-01-01 12:00 AM");
        DateTimeFormatter("2017-03-02").ShouldBe("2017-03-02 12:00 AM");
        DateTimeFormatter("2017-01-01 03:00").ShouldBe("2017-01-01 3:00 AM");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => DateTimeFormatter("2017-01-01 03:00 am", param));
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "yyyy" }.ToParam();
        DateTimeFormatter("2017-01-01", param).ShouldBe("2017");
      }
      /// should format: dateTime
      {
        var param = new { format = "dateTime" }.ToParam();
        DateTimeFormatter("2017-01-01 03:00 am", param).ShouldBe("01 January 2017 3:00 AM");
      }
      // should format: longDateTime
      {
        var param = new { format = "longDateTime" }.ToParam();
        DateTimeFormatter("2017-01-01 03:00 AM", param).ShouldBe("Sunday, January 1, 2017 3:00 AM");
      }
      // should format: longDate
      {
        var param = new { format = "longDate" }.ToParam();
        DateTimeFormatter("2017-01-01", param).ShouldBe("Sunday, January 1, 2017");
      }
      // should format: longTime
      {
        var param = new { format = "longTime" }.ToParam();
        DateTimeFormatter("2017-01-01 03:00:00 am", param).ShouldBe("03:00:00 AM");
      }
      // should format: shortDate
      {
        var param = new { format = "shortDate" }.ToParam();
        DateTimeFormatter("2017-01-01", param).ShouldBe("1-Jan-2017");
      }
      // should format: shorterDate
      {
        var param = new { format = "shorterDate" }.ToParam();
        DateTimeFormatter("2017-01-01", param).ShouldBe("Jan 1 2017");
      }
      // should format: shortTime
      {
        var param = new { format = "shortTime" }.ToParam();
        DateTimeFormatter("2017-01-01 03:00:00 am", param).ShouldBe("3:00 AM");
      }
      // should format: tinyDate
      {
        var param = new { format = "tinyDate" }.ToParam();
        DateTimeFormatter("2017-01-01 03:00:00 am", param).ShouldBe("1/1/17");
      }
      // should format: tinyDateTime
      {
        var param = new { format = "tinyDateTime" }.ToParam();
        DateTimeFormatter("2017-01-01 03:00:00 am", param).ShouldBe("1/1/17 3:00 AM");
      }
      // should parse
      {
        DateTimeParser(null).ShouldBe((null, true, null));
        DateTimeParser("").ShouldBe(("", true, null));
        DateTimeParser("1ab").ShouldBe(("1ab", false, null));
        DateTimeParser("blah").ToBlob().ShouldBe("blah,false,");
        DateTimeParser("2017-01-01 03:00:00 am").ToBlob().ShouldBe("1/1/2017 3:00:00 AM,true,");
        DateTimeParser("1901-01-01 03:00:00 am").ToBlob().ShouldBe("1/1/1901 3:00:00 AM,true,");
      }
      // should parse: minValue
      {
        DateTimeParser("2011-01-01", (new { minValue = Parse("2012-01-01") }).ToParam()).ToBlob().ShouldBe("2011-01-01,false,");
        DateTimeParser("2012-01-01", (new { minValue = Parse("1/1/2011") }).ToParam()).ToBlob().ShouldBe("1/1/2012 12:00:00 AM,true,");
      }
      // should parse: maxValue
      {
        DateTimeParser("2017-01-01", (new { maxValue = Parse("2012-01-01") }).ToParam()).ToBlob().ShouldBe("2017-01-01,false,");
        DateTimeParser("2011-01-01", (new { maxValue = Parse("1/1/2012") }).ToParam()).ToBlob().ShouldBe("1/1/2011 12:00:00 AM,true,");
      }
    }

    [Fact]
    public void MonthAndDay()
    {
      // should format
      {
        MonthAndDayFormatter(null).ShouldBe(NulFormat);
        MonthAndDayFormatter("").ShouldBe(NulFormat);
        MonthAndDayFormatter("1/1/2017").ShouldBe("01/01");
        MonthAndDayFormatter("2017-03-02").ShouldBe("03/02");
        MonthAndDayFormatter("2017-01-01 03:00").ShouldBe("01/01");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => MonthAndDayFormatter("2017-01-01", param));
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "yyyy" }.ToParam();
        MonthAndDayFormatter("2017-01-01", param).ShouldBe("2017");
      }
      // should parse
      {
        MonthAndDayParser(null).ShouldBe((null, true, null));
        MonthAndDayParser("").ShouldBe(("", true, null));
        MonthAndDayParser("1ab").ShouldBe(("1ab", false, null));
        MonthAndDayParser("blah").ToBlob().ShouldBe("blah,false,");
        MonthAndDayParser("31/12").ToBlob().ShouldBe("31/12,false,");
        MonthAndDayParser("12/40").ToBlob().ShouldBe("12/40,false,");
        MonthAndDayParser("12/31").ToBlob().ShouldBe("12/31/2000 12:00:00 AM,true,");
        MonthAndDayParser("12/31 3:00 pm").ToBlob().ShouldBe("12/31 3:00 pm,false,");
        MonthAndDayParser("00/00").ToBlob().ShouldBe("00/00,false,");
      }
    }

    [Fact]
    public void Time()
    {
      // should format
      {
        TimeFormatter(null).ShouldBe(NulFormat);
        TimeFormatter("").ShouldBe(NulFormat);
        TimeFormatter("1/1/2017").ShouldBe("12:00 AM");
        TimeFormatter("2017-01-01").ShouldBe("12:00 AM");
        TimeFormatter("2017-01-01 03:00").ShouldBe("3:00 AM");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => TimeFormatter("2017-01-01", param));
      }
      // should format: longTime
      {
        var param = new { format = "longTime" }.ToParam();
        TimeFormatter("2017-01-01", param).ShouldBe("12:00:00 AM");
      }
      // should format: shortTime
      {
        var param = new { format = "shortTime" }.ToParam();
        TimeFormatter("2017-01-01 17:00", param).ShouldBe("5:00 PM");
      }
      // should format: pattern
      {
        var param = new { format = "pattern", pattern = "hh tt" }.ToParam();
        TimeFormatter("2017-01-01 17:00", param).ShouldBe("05 PM");
      }
      // should parse
      {
        TimeParser(null).ShouldBe((null, true, null));
        TimeParser("").ShouldBe(("", true, null));
        TimeParser("1ab").ToBlob().ShouldBe("1ab,false,");
        TimeParser("blah").ToBlob().ShouldBe("blah,false,");
        TimeParser("3:00 pm").ToBlob().ShouldBe("1/1/2000 3:00:00 PM,true,");
        TimeParser("2012-01-01 3:11:01 pm").ToBlob().ShouldBe("1/1/2000 3:11:01 PM,true,");
        TimeParser("abc 3:00").ToBlob().ShouldBe("abc 3:00,false,"); // "1/1/2000 3:00:00 AM,true,"
      }
      // should parse: minValue
      {
        TimeParser("2012-01-01 3:11:01 pm", (new { minValue = Parse("5:00:00 pm") }).ToParam()).ToBlob().ShouldBe("2012-01-01 3:11:01 pm,false,");
        TimeParser("2012-01-01 3:11:01 pm", (new { minValue = Parse("1:00:00 am") }).ToParam()).ToBlob().ShouldBe("1/1/2000 3:11:01 PM,true,");
      }
      // should parse: maxValue
      {
        TimeParser("2012-01-01 3:11:01 pm", (new { maxValue = Parse("1:00:00 am") }).ToParam()).ToBlob().ShouldBe("2012-01-01 3:11:01 pm,false,");
        TimeParser("2012-01-01 3:11:01 pm", (new { maxValue = Parse("5:00:00 pm") }).ToParam()).ToBlob().ShouldBe("1/1/2000 3:11:01 PM,true,");
      }
    }
  }
}
