using System;
using Xunit;
using static CoreValidation.Formats.Logistics;
using static CoreValidation.Globals;

namespace CoreValidation.Tests
{
  public class FormatLogisticsTest
  {
    [Fact]
    public void Phone()
    {
      // should format
      {
        Assert2.Equal(PhoneFormater(null), NulFormat);
        Assert2.Equal(PhoneFormater(""), NulFormat);
        Assert2.Equal(PhoneFormater("816-304-4341"), "816-304-4341");
      }
      //should parse
      {
        Assert2.Equal(PhoneParser(null), (null, true, null));
        Assert2.Equal(PhoneParser(""), ("", true, null));
        Assert2.Equal(PhoneParser("123-456"), ("123-456", false, null));
        Assert2.Equal(PhoneParser("123-456-7890.1234"), ("(123) 456-7890 x1234", true, null));
        Assert2.Equal(PhoneParser("123-456-7890"), ("(123) 456-7890", true, null));
      }
      // should parse: _
      {
        var param = new { countries = "" }.ToParam();
        Assert2.Equal(PhoneParser("123.456.7890.1234", param), ("(123) 456-7890 x1234", true, null));
        Assert2.Equal(PhoneParser("123.456.7890.1234", param.Assign(new { layout = "-" })), ("123-456-7890 x1234", true, null));
        Assert2.Equal(PhoneParser("123.456.7890.1234", param.Assign(new { layout = "." })), ("123.456.7890 x1234", true, null));
        Assert2.Equal(PhoneParser("123.456.7890.1234", param.Assign(new { layout = "()" })), ("(123) 456-7890 x1234", true, null));
      }
      // should parse: *
      {
        var param = new { countries = "*" }.ToParam();
        Assert2.Equal(PhoneParser("123-456-7890.1234", param), ("123-456-7890.1234", true, null));
        Assert2.Equal(PhoneParser("123-456-7890", param), ("123-456-7890", true, null));
      }
      // should parse: usa
      {
        var param = new { countries = "u" }.ToParam();
        Assert2.Equal(PhoneParser("123.456.7890.1234", param), ("(123) 456-7890 x1234", true, null));
        Assert2.Equal(PhoneParser("123-456-7890", param), ("(123) 456-7890", true, null));
        Assert2.Equal(PhoneParser("456-7890", param), ("456-7890", false, null));
      }
      // should parse: canada
      {
        var param = new { countries = "c" }.ToParam();
        Assert2.Equal(PhoneParser("123.456.7890.1234", param), ("(123) 456-7890 x1234", true, null));
        Assert2.Equal(PhoneParser("123-456-7890", param), ("(123) 456-7890", true, null));
        Assert2.Equal(PhoneParser("456-7890", param), ("456-7890", false, null));
      }
      // should parse: unknown
      {
        var param = new { countries = "z" }.ToParam();
        Assert2.Equal(PhoneParser("123.456.7890.1234", param), ("123.456.7890.1234", false, null));
      }
      // should parse: layout
      {
        Assert2.Equal(PhoneParser("123.456.7890.1234", new { countries = "u", layout = "." }.ToParam()), ("123.456.7890 x1234", true, null));
        Assert2.Equal(PhoneParser("123.456.7890.1234", new { countries = "u", layout = "-" }.ToParam()), ("123-456-7890 x1234", true, null));
        Assert2.Equal(PhoneParser("123.456.7890.1234", new { countries = "u", layout = "()" }.ToParam()), ("(123) 456-7890 x1234", true, null));
        Assert.Throws<Exception>(() => PhoneParser("123.456.7890.1234", new { countries = "u", layout = "*" }.ToParam()));
      }
    }

    [Fact]
    public void Zip()
    {
      // should format", () =>
      {
        Assert2.Equal(ZipFormater(null), NulFormat);
        Assert2.Equal(ZipFormater(""), NulFormat);
        Assert2.Equal(ZipFormater("66211", new { }.ToParam()), "66211");
      }
      // should parse
      {
        Assert2.Equal(ZipParser(null), (null, true, null));
        Assert2.Equal(ZipParser(""), ("", true, null));
        Assert2.Equal(ZipParser("66211"), ("66211", true, null));
      }
      // should parse: _
      {
        var param = new { countries = "" }.ToParam();
        Assert2.Equal(ZipParser("12345-0123", param), ("12345-0123", true, null));
      }
      // should parse: *
      {
        var param = new { countries = "*" }.ToParam();
        Assert2.Equal(ZipParser("123", param), ("123", true, null));
        Assert2.Equal(ZipParser("12345", param), ("12345", true, null));
        Assert2.Equal(ZipParser("12345-123", param), ("12345-123", true, null));
      }
      // should parse: usa
      {
        var param = new { countries = "u" }.ToParam();
        Assert2.Equal(ZipParser("123", param), ("00123", true, null));
        Assert2.Equal(ZipParser("12345", param), ("12345", true, null));
        Assert2.Equal(ZipParser("123456", param), ("123456", false, null));
        Assert2.Equal(ZipParser("12345-0123", param), ("12345-0123", true, null));
        Assert2.Equal(ZipParser("12345-1234", param), ("12345-1234", true, null));
      }
      // should parse: canada
      {
        var param = new { countries = "c" }.ToParam();
        Assert2.Equal(ZipParser("12345", param), ("12345", false, null));
        Assert2.Equal(ZipParser("123 456", param), ("123 456", false, null));
        Assert2.Equal(ZipParser("K8N 5W6", param), ("K8N 5W6", true, null));
      }
      // should parse: unknown
      {
        var param = new { countries = "z" }.ToParam();
        Assert2.Equal(ZipParser("12345", param), ("12345", false, null));
      }
    }
  }
}
