using Shouldly;
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
        BoolFormatter(null).ShouldBe(NulFormat);
        BoolFormatter("").ShouldBe(NulFormat);
        BoolFormatter("af").ShouldBe(NulFormat);
        BoolFormatter("0").ShouldBe("No");
        BoolFormatter("12").ShouldBe("Yes");
      }
      // should format: *
      {
        var param = new { format = "*" }.ToParam();
        Assert.Throws<ArgumentOutOfRangeException>(() => BoolFormatter("12", param));
      }
      // should format: trueFalse
      {
        var param = new { format = "trueFalse" }.ToParam();
        BoolFormatter("12", param).ShouldBe("True");
        BoolFormatter("0", param).ShouldBe("False");
      }
      // should format: yesNo
      {
        var param = new { format = "yesNo" }.ToParam();
        BoolFormatter("12", param).ShouldBe("Yes");
        BoolFormatter("0", param).ShouldBe("No");
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
        BoolFormatter("af", new { format = "values", values = new[] { "1", "0" } }.ToParam()).ShouldBe(NulFormat);
        BoolFormatter("12", new { format = "values", values = new[] { "1", "0" } }.ToParam()).ShouldBe("1");
        BoolFormatter("0", new { format = "values", values = new[] { "1", "0" } }.ToParam()).ShouldBe("0");
      }
      // should parse
      {
        BoolParser(null).ShouldBe((null, true, null));
        BoolParser("").ShouldBe(("", true, null));
        BoolParser("A").ShouldBe(("A", false, null));
        BoolParser("Yes").ShouldBe((true, true, null));
        BoolParser("On").ShouldBe((true, true, null));
        BoolParser("true").ShouldBe((true, true, null));
        BoolParser("y").ShouldBe((true, true, null));
        BoolParser("1").ShouldBe((true, true, null));
        BoolParser("No").ShouldBe((false, true, null));
        BoolParser("Off").ShouldBe((false, true, null));
        BoolParser("false").ShouldBe((false, true, null));
        BoolParser("n").ShouldBe((false, true, null));
        BoolParser("0").ShouldBe((false, true, null));
      }
    }

    [Fact]
    public void Decimal()
    {
      // should format
      {
        DecimalFormatter(null).ShouldBe(NulFormat);
        DecimalFormatter("").ShouldBe(NulFormat);
        DecimalFormatter("ABC").ShouldBe(NulFormat);
        DecimalFormatter("12").ShouldBe("12.0000");
      }
      // should format: *
      {
        Assert.Throws<ArgumentOutOfRangeException>(() => DecimalFormatter("12", new { format = "*" }.ToParam()));
      }
      // should format: comma
      {
        DecimalFormatter(float.NaN, new { format = "comma" }.ToParam()).ShouldBe(NulFormat);
        DecimalFormatter("1232323", new { format = "comma" }.ToParam()).ShouldBe("1,232,323");
        DecimalFormatter("1232323.234", new { format = "comma" }.ToParam()).ShouldBe("1,232,323.234");
        DecimalFormatter("12", new { format = "comma" }.ToParam()).ShouldBe("12");
        DecimalFormatter("12.234", new { format = "comma" }.ToParam()).ShouldBe("12.234");
      }
      // should format: nx
      {
        DecimalFormatter("12", new { format = "n2" }.ToParam()).ShouldBe("12.00");
        DecimalFormatter("12", new { format = "n3" }.ToParam()).ShouldBe("12.000");
      }
      // should format: pattern
      {
        DecimalFormatter("12", new { format = "pattern", pattern = "n2" }.ToParam()).ShouldBe("12.00");
        DecimalFormatter("12", new { format = "pattern", pattern = "#" }.ToParam()).ShouldBe("12");
      }
      //  should parse
      {
        DecimalParser(null).ShouldBe((null, true, null));
        DecimalParser("").ShouldBe(("", true, null));
        DecimalParser("NaN").ShouldBe(("NaN", false, null));
        //DecimalParser(NaN).ShouldBe( (NaN, true, null));
        DecimalParser("12").ShouldBe((12M, true, null));
      }
      // should parse: minValue
      {
        DecimalParser("13.0", new { minValue = 12M }.ToParam()).ShouldBe((13M, true, null));
        DecimalParser("12.0", new { minValue = 13M }.ToParam()).ShouldBe(("12.0", false, null));
      }
      // should parse: maxValue
      {
        DecimalParser("12.0", new { maxValue = 23M }.ToParam()).ShouldBe((12M, true, null));
        DecimalParser("22.0", new { maxValue = 13M }.ToParam()).ShouldBe(("22.0", false, null));
      }
      // should parse: precision
      {
        DecimalParser("22.123", new { precision = 2 }.ToParam()).ShouldBe(("22.123", false, null));
        DecimalParser("22.12", new { precision = 2 }.ToParam()).ShouldBe((22.12M, true, null));
      }
      // should parse: round
      {
        DecimalParser("22.123", new { round = 1 }.ToParam()).ShouldBe((22.1M, true, null));
        DecimalParser("22.123", new { round = 2 }.ToParam()).ShouldBe((22.12M, true, null));
      }
    }

    [Fact]
    public void Integer()
    {
      // should format
      {
        IntegerFormatter(null).ShouldBe(NulFormat);
        IntegerFormatter("").ShouldBe(NulFormat);
        IntegerFormatter("A").ShouldBe(NulFormat);
        IntegerFormatter("12").ShouldBe("12");
      }
      // should format: *
      {
        Assert.Throws<ArgumentOutOfRangeException>(() => IntegerFormatter("12", new { format = "*" }.ToParam()));
      }
      // should format: comma
      {
        IntegerFormatter(float.NaN, new { format = "comma" }.ToParam()).ShouldBe(NulFormat);
        IntegerFormatter("1232323", new { format = "comma" }.ToParam()).ShouldBe("1,232,323");
        IntegerFormatter("12", new { format = "comma" }.ToParam()).ShouldBe("12");
      }
      // should format: byte
      {
        var param = new { format = "byte" }.ToParam();
        IntegerFormatter("1232323", param).ShouldBe("1.18 MB");
        IntegerFormatter("2048", param).ShouldBe("2 KB");
        IntegerFormatter("2", param).ShouldBe("2 bytes");
        IntegerFormatter("1", param).ShouldBe("1 byte");
        IntegerFormatter("0", param).ShouldBe("0 bytes");
      }
      // should format: pattern
      {
        IntegerFormatter("1232323", new { format = "pattern", pattern = "#" }.ToParam()).ShouldBe("1232323");
      }
      // should parse
      {
        IntegerParser(null).ShouldBe((null, true, null));
        IntegerParser("").ShouldBe(("", true, null));
        IntegerParser("NaN").ShouldBe(("NaN", false, null));
        //IntegerParser(NaN).ShouldBe( (NaN, true, null));
        IntegerParser("12").ShouldBe((12, true, null));
      }
      // should parse: minValue
      {
        IntegerParser("13.0", new { minValue = 12 }.ToParam()).ShouldBe((13, true, null));
        IntegerParser("12.0", new { minValue = 13 }.ToParam()).ShouldBe(("12.0", false, null));
      }
      // should parse: maxValue
      {
        IntegerParser("12.0", new { maxValue = 23 }.ToParam()).ShouldBe((12, true, null));
        IntegerParser("22.0", new { maxValue = 13 }.ToParam()).ShouldBe(("22.0", false, null));
      }
    }

    [Fact]
    public void Money()
    {
      // should format
      {
        MoneyFormatter(null).ShouldBe(NulFormat);
        MoneyFormatter("").ShouldBe(NulFormat);
        MoneyFormatter("A").ShouldBe(NulFormat);
        MoneyFormatter("12").ShouldBe("$12.00");
      }
      // should format: *
      {
        Assert.Throws<ArgumentOutOfRangeException>(() => MoneyFormatter("12", new { format = "*" }.ToParam()));
      }
      // should format: nx
      {
        MoneyFormatter("12", new { format = "c2" }.ToParam()).ShouldBe("$12.00");
        MoneyFormatter("12", new { format = "c3" }.ToParam()).ShouldBe("$12.000");
      }
      // should format: pattern
      {
        MoneyFormatter("12", new { format = "pattern", pattern = "c2" }.ToParam()).ShouldBe("$12.00");
        MoneyFormatter("12", new { format = "pattern", pattern = "#" }.ToParam()).ShouldBe("12");
      }
      // should parse
      {
        MoneyParser(null).ShouldBe((null, true, null));
        MoneyParser("").ShouldBe(("", true, null));
        MoneyParser("NaN").ShouldBe(("", false, null));
        //MoneyParser(NaN).ShouldBe( (NaN, true, null));
        MoneyParser("12").ShouldBe((12M, true, null));
      }
      // should parse: minValue
      {
        MoneyParser("13.0", new { minValue = 12M }.ToParam()).ShouldBe((13M, true, null));
        MoneyParser("12.0", new { minValue = 13M }.ToParam()).ShouldBe(("12.0", false, null));
      }
      // should parse: maxValue
      {
        MoneyParser("12.0", new { maxValue = 23M }.ToParam()).ShouldBe((12M, true, null));
        MoneyParser("22.0", new { maxValue = 13M }.ToParam()).ShouldBe(("22.0", false, null));
      }
      // should parse: precision
      {
        MoneyParser("22.123", new { precision = 2 }.ToParam()).ShouldBe(("22.123", false, null));
        MoneyParser("22.12", new { precision = 2 }.ToParam()).ShouldBe((22.12M, true, null));
      }
      // should parse: round
      {
        MoneyParser("22.123", new { round = 1 }.ToParam()).ShouldBe((22.1M, true, null));
        MoneyParser("22.123", new { round = 2 }.ToParam()).ShouldBe((22.12M, true, null));
      }
    }

    [Fact]
    public void Percent()
    {
      // should format
      {
        PercentFormatter(null).ShouldBe(NulFormat);
        PercentFormatter("").ShouldBe(NulFormat);
        PercentFormatter("A").ShouldBe(NulFormat);
        PercentFormatter(".12").ShouldBe("12.00%");
      }
      // should format: *
      {
        Assert.Throws<ArgumentOutOfRangeException>(() => PercentFormatter("12", new { format = "*" }.ToParam()));
      }
      //should format: nx
      {
        PercentFormatter(".12", new { format = "p2" }.ToParam()).ShouldBe("12.00%");
        PercentFormatter(".12", new { format = "p3" }.ToParam()).ShouldBe("12.000%");
        PercentFormatter(".12", new { format = "p4" }.ToParam()).ShouldBe("12.0000%");
      }
      // should format: pattern
      {
        PercentFormatter(".12", new { format = "pattern", pattern = "p2" }.ToParam()).ShouldBe("12.00%");
        PercentFormatter(".12", new { format = "pattern", pattern = ".##" }.ToParam()).ShouldBe(".12");
      }
      // should parse
      {
        PercentParser(null).ShouldBe((null, true, null));
        PercentParser("").ShouldBe(("", true, null));
        PercentParser("NaN").ShouldBe(("NaN", false, null));
        //PercentParser(NaN).ShouldBe( (NaN, true, null));
        PercentParser("12").ShouldBe((.12, true, null));
        PercentParser("12%").ShouldBe((.12, true, null));
      }
    }

    [Fact]
    public void Real()
    {
      // should format
      {
        RealFormatter(null).ShouldBe(NulFormat);
        RealFormatter("").ShouldBe(NulFormat);
        RealFormatter("A").ShouldBe(NulFormat);
        RealFormatter("12").ShouldBe("12.0000");
      }
      // should format: *
      {
        Assert.Throws<ArgumentOutOfRangeException>(() => RealFormatter("12", new { format = "*" }.ToParam()));
      }
      // should format: comma
      {
        RealFormatter(double.NaN, new { format = "comma" }.ToParam()).ShouldBe(NulFormat);
        RealFormatter("1232323", new { format = "comma" }.ToParam()).ShouldBe("1,232,323");
        RealFormatter("1232323.234", new { format = "comma" }.ToParam()).ShouldBe("1,232,323.234");
        RealFormatter("12", new { format = "comma" }.ToParam()).ShouldBe("12");
        RealFormatter("12.234", new { format = "comma" }.ToParam()).ShouldBe("12.234");
      }
      // should format: nx
      {
        RealFormatter("12", new { format = "n2" }.ToParam()).ShouldBe("12.00");
        RealFormatter("12", new { format = "n3" }.ToParam()).ShouldBe("12.000");
      }
      // should format: pattern
      {
        RealFormatter("12", new { format = "pattern", pattern = "n2" }.ToParam()).ShouldBe("12.00");
        RealFormatter("12", new { format = "pattern", pattern = "#" }.ToParam()).ShouldBe("12");
      }
      // should parse
      {
        RealParser(null).ShouldBe((null, true, null));
        RealParser("").ShouldBe(("", true, null));
        RealParser("NaN").ShouldBe(("NaN", false, null));
        //RealParser(NaN).ShouldBe( (NaN, true, null));
        RealParser("12").ShouldBe((12.0, true, null));
      }
      // should parse: minValue
      {
        RealParser("13.0", new { minValue = 12.0 }.ToParam()).ShouldBe((13.0, true, null));
        RealParser("12.0", new { minValue = 13.0 }.ToParam()).ShouldBe(("12.0", false, null));
      }
      // should parse: maxValue
      {
        RealParser("12.0", new { maxValue = 23.0 }.ToParam()).ShouldBe((12.0, true, null));
        RealParser("22.0", new { maxValue = 13.0 }.ToParam()).ShouldBe(("22.0", false, null));
      }
      // should parse: precision
      {
        RealParser("22.123", new { precision = 2 }.ToParam()).ShouldBe(("22.123", false, null));
        RealParser("22.12", new { precision = 2 }.ToParam()).ShouldBe((22.12, true, null));
      }
      // should parse: round
      {
        RealParser("22.123", new { round = 1 }.ToParam()).ShouldBe((22.1, true, null));
        RealParser("22.123", new { round = 2 }.ToParam()).ShouldBe((22.12, true, null));
      }
    }
  }
}
