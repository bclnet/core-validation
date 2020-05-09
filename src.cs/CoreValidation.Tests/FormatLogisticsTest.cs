using Shouldly;
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
        PhoneFormatter(null).ShouldBe(NulFormat);
        PhoneFormatter("").ShouldBe(NulFormat);
        PhoneFormatter("816-304-4341").ShouldBe("816-304-4341");
      }
      //should parse
      {
        PhoneParser(null).ShouldBe((null, true, null));
        PhoneParser("").ShouldBe(("", true, null));
        PhoneParser("123-456").ShouldBe(("123-456", false, null));
        PhoneParser("123-456-7890.1234").ShouldBe(("(123) 456-7890 x1234", true, null));
        PhoneParser("123-456-7890").ShouldBe(("(123) 456-7890", true, null));
      }
      // should parse: _
      {
        var param = new { countries = "" }.ToParam();
        PhoneParser("123.456.7890.1234", param).ShouldBe(("(123) 456-7890 x1234", true, null));
        PhoneParser("123.456.7890.1234", param.Assign(new { layout = "-" })).ShouldBe(("123-456-7890 x1234", true, null));
        PhoneParser("123.456.7890.1234", param.Assign(new { layout = "." })).ShouldBe(("123.456.7890 x1234", true, null));
        PhoneParser("123.456.7890.1234", param.Assign(new { layout = "()" })).ShouldBe(("(123) 456-7890 x1234", true, null));
      }
      // should parse: *
      {
        var param = new { countries = "*" }.ToParam();
        PhoneParser("123-456-7890.1234", param).ShouldBe(("123-456-7890.1234", true, null));
        PhoneParser("123-456-7890", param).ShouldBe(("123-456-7890", true, null));
      }
      // should parse: usa
      {
        var param = new { countries = "u" }.ToParam();
        PhoneParser("123.456.7890.1234", param).ShouldBe(("(123) 456-7890 x1234", true, null));
        PhoneParser("123-456-7890", param).ShouldBe(("(123) 456-7890", true, null));
        PhoneParser("456-7890", param).ShouldBe(("456-7890", false, null));
      }
      // should parse: canada
      {
        var param = new { countries = "c" }.ToParam();
        PhoneParser("123.456.7890.1234", param).ShouldBe(("(123) 456-7890 x1234", true, null));
        PhoneParser("123-456-7890", param).ShouldBe(("(123) 456-7890", true, null));
        PhoneParser("456-7890", param).ShouldBe(("456-7890", false, null));
      }
      // should parse: unknown
      {
        var param = new { countries = "z" }.ToParam();
        PhoneParser("123.456.7890.1234", param).ShouldBe(("123.456.7890.1234", false, null));
      }
      // should parse: layout
      {
        PhoneParser("123.456.7890.1234", new { countries = "u", layout = "." }.ToParam()).ShouldBe(("123.456.7890 x1234", true, null));
        PhoneParser("123.456.7890.1234", new { countries = "u", layout = "-" }.ToParam()).ShouldBe(("123-456-7890 x1234", true, null));
        PhoneParser("123.456.7890.1234", new { countries = "u", layout = "()" }.ToParam()).ShouldBe(("(123) 456-7890 x1234", true, null));
        Assert.Throws<ArgumentOutOfRangeException>(() => PhoneParser("123.456.7890.1234", new { countries = "u", layout = "*" }.ToParam()));
      }
    }

    [Fact]
    public void Zip()
    {
      // should format", () =>
      {
        ZipFormatter(null).ShouldBe(NulFormat);
        ZipFormatter("").ShouldBe(NulFormat);
        ZipFormatter("66211", new { }.ToParam()).ShouldBe("66211");
      }
      // should parse
      {
        ZipParser(null).ShouldBe((null, true, null));
        ZipParser("").ShouldBe(("", true, null));
        ZipParser("66211").ShouldBe(("66211", true, null));
      }
      // should parse: _
      {
        var param = new { countries = "" }.ToParam();
        ZipParser("12345-0123", param).ShouldBe(("12345-0123", true, null));
      }
      // should parse: *
      {
        var param = new { countries = "*" }.ToParam();
        ZipParser("123", param).ShouldBe(("123", true, null));
        ZipParser("12345", param).ShouldBe(("12345", true, null));
        ZipParser("12345-123", param).ShouldBe(("12345-123", true, null));
      }
      // should parse: usa
      {
        var param = new { countries = "u" }.ToParam();
        ZipParser("123", param).ShouldBe(("00123", true, null));
        ZipParser("12345", param).ShouldBe(("12345", true, null));
        ZipParser("123456", param).ShouldBe(("123456", false, null));
        ZipParser("12345-0123", param).ShouldBe(("12345-0123", true, null));
        ZipParser("12345-1234", param).ShouldBe(("12345-1234", true, null));
      }
      // should parse: canada
      {
        var param = new { countries = "c" }.ToParam();
        ZipParser("12345", param).ShouldBe(("12345", false, null));
        ZipParser("123 456", param).ShouldBe(("123 456", false, null));
        ZipParser("K8N 5W6", param).ShouldBe(("K8N 5W6", true, null));
      }
      // should parse: unknown
      {
        var param = new { countries = "z" }.ToParam();
        ZipParser("12345", param).ShouldBe(("12345", false, null));
      }
    }
  }
}
