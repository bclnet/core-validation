using System;
using Xunit;
using static CoreValidation.Formats.Number;
using static CoreValidation.Globals;

namespace CoreValidation.Tests
{
  public class FormatNumberTest
  {
    [Fact]
    public void Bool()
    {
      // should format
      {
        Assert2.Equal(BoolFormatter(null), NulFormat);
        Assert2.Equal(BoolFormatter(""), NulFormat);
        Assert2.Equal(BoolFormatter("af"), NulFormat);
        Assert2.Equal(BoolFormatter("0"), "No");
        Assert2.Equal(BoolFormatter("12"), "Yes");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => BoolFormatter("12", param));
      }
      // should format: trueFalse
      {
        var param = new { format = "trueFalse" }.ToParam();
        Assert2.Equal(BoolFormatter("12", param), "True");
        Assert2.Equal(BoolFormatter("0", param), "False");
      }
      // should format: yesNo
      {
        var param = new { format = "yesNo" }.ToParam();
        Assert2.Equal(BoolFormatter("12", param), "Yes");
        Assert2.Equal(BoolFormatter("0", param), "No");
      }
      // should format: values no values
      {
        Assert.Throws<ArgumentOutOfRangeException>(() => BoolFormatter("12", new { format = "values" }.ToParam()));
        Assert.Throws<ArgumentOutOfRangeException>(() => BoolFormatter("12", new { format = "values", values = "" }.ToParam()));
        Assert.Throws<ArgumentOutOfRangeException>(() => BoolFormatter("1", new { format = "values", values = (string)null }.ToParam()));
        Assert.Throws<ArgumentOutOfRangeException>(() => BoolFormatter("1", new { format = "values", values = "1" }.ToParam()));
        Assert.Throws<ArgumentOutOfRangeException>(() => BoolFormatter("1", new { format = "values", values = new string[0] }.ToParam()));
        Assert.Throws<ArgumentOutOfRangeException>(() => BoolFormatter("1", new { format = "values", values = new[] { "1" } }.ToParam()));
        Assert.Throws<ArgumentOutOfRangeException>(() => BoolFormatter("1", new { format = "values", values = new[] { "1", "2", "3" } }.ToParam()));
        Assert2.Equal(BoolFormatter("af", new { format = "values", values = new[] { "1", "0" } }.ToParam()), NulFormat);
        Assert2.Equal(BoolFormatter("12", new { format = "values", values = new[] { "1", "0" } }.ToParam()), "1");
        Assert2.Equal(BoolFormatter("0", new { format = "values", values = new[] { "1", "0" } }.ToParam()), "0");
      }
      // should parse
      {
        Assert2.Equal(BoolParser(null), (null, true, null));
        Assert2.Equal(BoolParser(""), ("", true, null));
        Assert2.Equal(BoolParser("A"), ("A", false, null));
        Assert2.Equal(BoolParser("Yes"), (true, true, null));
        Assert2.Equal(BoolParser("On"), (true, true, null));
        Assert2.Equal(BoolParser("true"), (true, true, null));
        Assert2.Equal(BoolParser("y"), (true, true, null));
        Assert2.Equal(BoolParser("1"), (true, true, null));
        Assert2.Equal(BoolParser("No"), (false, true, null));
        Assert2.Equal(BoolParser("Off"), (false, true, null));
        Assert2.Equal(BoolParser("false"), (false, true, null));
        Assert2.Equal(BoolParser("n"), (false, true, null));
        Assert2.Equal(BoolParser("0"), (false, true, null));
      }
    }

    [Fact]
    public void Decimal()
    {
      // should format
      {
        Assert2.Equal(DecimalFormatter(null), NulFormat);
        Assert2.Equal(DecimalFormatter(""), NulFormat);
        Assert2.Equal(DecimalFormatter("ABC"), NulFormat);
        Assert2.Equal(DecimalFormatter("12"), "12.0000");
      }
      // should format: *
      {
        Assert.Throws<ArgumentOutOfRangeException>(() => DecimalFormatter("12", new { format = "*" }.ToParam()));
      }
      // should format: comma
      {
        Assert2.Equal(DecimalFormatter(float.NaN, new { format = "comma" }.ToParam()), NulFormat);
        Assert2.Equal(DecimalFormatter("1232323", new { format = "comma" }.ToParam()), "1,232,323");
        Assert2.Equal(DecimalFormatter("1232323.234", new { format = "comma" }.ToParam()), "1,232,323.234");
        Assert2.Equal(DecimalFormatter("12", new { format = "comma" }.ToParam()), "12");
        Assert2.Equal(DecimalFormatter("12.234", new { format = "comma" }.ToParam()), "12.234");
      }
      // should format: nx
      {
        Assert2.Equal(DecimalFormatter("12", new { format = "n2" }.ToParam()), "12.00");
        Assert2.Equal(DecimalFormatter("12", new { format = "n3" }.ToParam()), "12.000");
      }
      // should format: pattern
      {
        Assert2.Equal(DecimalFormatter("12", new { format = "pattern", pattern = "n2" }.ToParam()), "12.00");
        Assert2.Equal(DecimalFormatter("12", new { format = "pattern", pattern = "#" }.ToParam()), "12");
      }
      //  should parse
      {
        Assert2.Equal(DecimalParser(null), (null, true, null));
        Assert2.Equal(DecimalParser(""), ("", true, null));
        Assert2.Equal(DecimalParser("NaN"), ("NaN", false, null));
        //Assert2.Equal(DecimalParser(NaN), (NaN, true, null));
        Assert2.Equal(DecimalParser("12"), (12M, true, null));
      }
      // should parse: minValue
      {
        Assert2.Equal(DecimalParser("13.0", new { minValue = 12M }.ToParam()), (13M, true, null));
        Assert2.Equal(DecimalParser("12.0", new { minValue = 13M }.ToParam()), ("12.0", false, null));
      }
      // should parse: maxValue
      {
        Assert2.Equal(DecimalParser("12.0", new { maxValue = 23M }.ToParam()), (12M, true, null));
        Assert2.Equal(DecimalParser("22.0", new { maxValue = 13M }.ToParam()), ("22.0", false, null));
      }
      // should parse: precision
      {
        Assert2.Equal(DecimalParser("22.123", new { precision = 2 }.ToParam()), ("22.123", false, null));
        Assert2.Equal(DecimalParser("22.12", new { precision = 2 }.ToParam()), (22.12M, true, null));
      }
      // should parse: round
      {
        Assert2.Equal(DecimalParser("22.123", new { round = 1 }.ToParam()), (22.1M, true, null));
        Assert2.Equal(DecimalParser("22.123", new { round = 2 }.ToParam()), (22.12M, true, null));
      }
    }

    [Fact]
    public void Integer()
    {
      // should format
      {
        Assert2.Equal(IntegerFormatter(null), NulFormat);
        Assert2.Equal(IntegerFormatter(""), NulFormat);
        Assert2.Equal(IntegerFormatter("A"), NulFormat);
        Assert2.Equal(IntegerFormatter("12"), "12");
      }
      // should format: *
      {
        Assert.Throws<ArgumentOutOfRangeException>(() => IntegerFormatter("12", new { format = "*" }.ToParam()));
      }
      // should format: comma
      {
        Assert2.Equal(IntegerFormatter(float.NaN, new { format = "comma" }.ToParam()), NulFormat);
        Assert2.Equal(IntegerFormatter("1232323", new { format = "comma" }.ToParam()), "1,232,323");
        Assert2.Equal(IntegerFormatter("12", new { format = "comma" }.ToParam()), "12");
      }
      // should format: byte
      {
        var param = new { format = "byte" }.ToParam();
        Assert2.Equal(IntegerFormatter("1232323", param), "1.18 MB");
        Assert2.Equal(IntegerFormatter("2048", param), "2 KB");
        Assert2.Equal(IntegerFormatter("2", param), "2 bytes");
        Assert2.Equal(IntegerFormatter("1", param), "1 byte");
        Assert2.Equal(IntegerFormatter("0", param), "0 bytes");
      }
      // should format: pattern
      {
        Assert2.Equal(IntegerFormatter("1232323", new { format = "pattern", pattern = "#" }.ToParam()), "1232323");
      }
      // should parse
      {
        Assert2.Equal(IntegerParser(null), (null, true, null));
        Assert2.Equal(IntegerParser(""), ("", true, null));
        Assert2.Equal(IntegerParser("NaN"), ("NaN", false, null));
        //Assert2.Equal(IntegerParser(NaN), (NaN, true, null));
        Assert2.Equal(IntegerParser("12"), (12, true, null));
      }
      // should parse: minValue
      {
        Assert2.Equal(IntegerParser("13.0", new { minValue = 12 }.ToParam()), (13, true, null));
        Assert2.Equal(IntegerParser("12.0", new { minValue = 13 }.ToParam()), ("12.0", false, null));
      }
      // should parse: maxValue
      {
        Assert2.Equal(IntegerParser("12.0", new { maxValue = 23 }.ToParam()), (12, true, null));
        Assert2.Equal(IntegerParser("22.0", new { maxValue = 13 }.ToParam()), ("22.0", false, null));
      }
    }

    [Fact]
    public void Money()
    {
      // should format
      {
        Assert2.Equal(MoneyFormatter(null), NulFormat);
        Assert2.Equal(MoneyFormatter(""), NulFormat);
        Assert2.Equal(MoneyFormatter("A"), NulFormat);
        Assert2.Equal(MoneyFormatter("12"), "$12.00");
      }
      // should format: *
      {
        Assert.Throws<ArgumentOutOfRangeException>(() => MoneyFormatter("12", new { format = "*" }.ToParam()));
      }
      // should format: nx
      {
        Assert2.Equal(MoneyFormatter("12", new { format = "c2" }.ToParam()), "$12.00");
        Assert2.Equal(MoneyFormatter("12", new { format = "c3" }.ToParam()), "$12.000");
      }
      // should format: pattern
      {
        Assert2.Equal(MoneyFormatter("12", new { format = "pattern", pattern = "c2" }.ToParam()), "$12.00");
        Assert2.Equal(MoneyFormatter("12", new { format = "pattern", pattern = "#" }.ToParam()), "12");
      }
      // should parse
      {
        Assert2.Equal(MoneyParser(null), (null, true, null));
        Assert2.Equal(MoneyParser(""), ("", true, null));
        Assert2.Equal(MoneyParser("NaN"), ("", false, null));
        //Assert2.Equal(MoneyParser(NaN), (NaN, true, null));
        Assert2.Equal(MoneyParser("12"), (12M, true, null));
      }
      // should parse: minValue
      {
        Assert2.Equal(MoneyParser("13.0", new { minValue = 12M }.ToParam()), (13M, true, null));
        Assert2.Equal(MoneyParser("12.0", new { minValue = 13M }.ToParam()), ("12.0", false, null));
      }
      // should parse: maxValue
      {
        Assert2.Equal(MoneyParser("12.0", new { maxValue = 23M }.ToParam()), (12M, true, null));
        Assert2.Equal(MoneyParser("22.0", new { maxValue = 13M }.ToParam()), ("22.0", false, null));
      }
      // should parse: precision
      {
        Assert2.Equal(MoneyParser("22.123", new { precision = 2 }.ToParam()), ("22.123", false, null));
        Assert2.Equal(MoneyParser("22.12", new { precision = 2 }.ToParam()), (22.12M, true, null));
      }
      // should parse: round
      {
        Assert2.Equal(MoneyParser("22.123", new { round = 1 }.ToParam()), (22.1M, true, null));
        Assert2.Equal(MoneyParser("22.123", new { round = 2 }.ToParam()), (22.12M, true, null));
      }
    }

    [Fact]
    public void Percent()
    {
      // should format
      {
        Assert2.Equal(PercentFormatter(null), NulFormat);
        Assert2.Equal(PercentFormatter(""), NulFormat);
        Assert2.Equal(PercentFormatter("A"), NulFormat);
        Assert2.Equal(PercentFormatter(".12"), "12.00%");
      }
      // should format: *
      {
        Assert.Throws<ArgumentOutOfRangeException>(() => PercentFormatter("12", new { format = "*" }.ToParam()));
      }
      //should format: nx
      {
        Assert2.Equal(PercentFormatter(".12", new { format = "p2" }.ToParam()), "12.00%");
        Assert2.Equal(PercentFormatter(".12", new { format = "p3" }.ToParam()), "12.000%");
        Assert2.Equal(PercentFormatter(".12", new { format = "p4" }.ToParam()), "12.0000%");
      }
      // should format: pattern
      {
        Assert2.Equal(PercentFormatter(".12", new { format = "pattern", pattern = "p2" }.ToParam()), "12.00%");
        Assert2.Equal(PercentFormatter(".12", new { format = "pattern", pattern = ".##" }.ToParam()), ".12");
      }
      // should parse
      {
        Assert2.Equal(PercentParser(null), (null, true, null));
        Assert2.Equal(PercentParser(""), ("", true, null));
        Assert2.Equal(PercentParser("NaN"), ("NaN", false, null));
        //Assert2.Equal(PercentParser(NaN), (NaN, true, null));
        Assert2.Equal(PercentParser("12"), (.12, true, null));
        Assert2.Equal(PercentParser("12%"), (.12, true, null));
      }
    }

    [Fact]
    public void Real()
    {
      // should format
      {
        Assert2.Equal(RealFormatter(null), NulFormat);
        Assert2.Equal(RealFormatter(""), NulFormat);
        Assert2.Equal(RealFormatter("A"), NulFormat);
        Assert2.Equal(RealFormatter("12"), "12.0000");
      }
      // should format: *
      {
        Assert.Throws<ArgumentOutOfRangeException>(() => RealFormatter("12", new { format = "*" }.ToParam()));
      }
      // should format: comma
      {
        Assert2.Equal(RealFormatter(double.NaN, new { format = "comma" }.ToParam()), NulFormat);
        Assert2.Equal(RealFormatter("1232323", new { format = "comma" }.ToParam()), "1,232,323");
        Assert2.Equal(RealFormatter("1232323.234", new { format = "comma" }.ToParam()), "1,232,323.234");
        Assert2.Equal(RealFormatter("12", new { format = "comma" }.ToParam()), "12");
        Assert2.Equal(RealFormatter("12.234", new { format = "comma" }.ToParam()), "12.234");
      }
      // should format: nx
      {
        Assert2.Equal(RealFormatter("12", new { format = "n2" }.ToParam()), "12.00");
        Assert2.Equal(RealFormatter("12", new { format = "n3" }.ToParam()), "12.000");
      }
      // should format: pattern
      {
        Assert2.Equal(RealFormatter("12", new { format = "pattern", pattern = "n2" }.ToParam()), "12.00");
        Assert2.Equal(RealFormatter("12", new { format = "pattern", pattern = "#" }.ToParam()), "12");
      }
      // should parse
      {
        Assert2.Equal(RealParser(null), (null, true, null));
        Assert2.Equal(RealParser(""), ("", true, null));
        Assert2.Equal(RealParser("NaN"), ("NaN", false, null));
        //Assert2.Equal(RealParser(NaN), (NaN, true, null));
        Assert2.Equal(RealParser("12"), (12.0, true, null));
      }
      // should parse: minValue
      {
        Assert2.Equal(RealParser("13.0", new { minValue = 12.0 }.ToParam()), (13.0, true, null));
        Assert2.Equal(RealParser("12.0", new { minValue = 13.0 }.ToParam()), ("12.0", false, null));
      }
      // should parse: maxValue
      {
        Assert2.Equal(RealParser("12.0", new { maxValue = 23.0 }.ToParam()), (12.0, true, null));
        Assert2.Equal(RealParser("22.0", new { maxValue = 13.0 }.ToParam()), ("22.0", false, null));
      }
      // should parse: precision
      {
        Assert2.Equal(RealParser("22.123", new { precision = 2 }.ToParam()), ("22.123", false, null));
        Assert2.Equal(RealParser("22.12", new { precision = 2 }.ToParam()), (22.12, true, null));
      }
      // should parse: round
      {
        Assert2.Equal(RealParser("22.123", new { round = 1 }.ToParam()), (22.1, true, null));
        Assert2.Equal(RealParser("22.123", new { round = 2 }.ToParam()), (22.12, true, null));
      }
    }
  }
}
