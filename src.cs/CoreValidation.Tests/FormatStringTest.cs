using Shouldly;
using Xunit;
using static CoreValidation.Formats.String;
using static CoreValidation.Globals;

namespace CoreValidation.Tests
{
  public class FormatStringTest
  {
    [Fact]
    public void Text()
    {
      // should format
      {
        TextFormatter(null).ShouldBe(NulFormat);
        TextFormatter("").ShouldBe(NulFormat);
        TextFormatter("12").ShouldBe("12");
      }
      // should parse
      {
        TextParser(null).ShouldBe((null, true, null));
        TextParser("").ShouldBe(("", true, null));
        TextParser("123-456").ShouldBe(("123-456", true, null));
      }
    }

    [Fact]
    public void Memo()
    {
      // should format
      {
        MemoFormatter(null).ShouldBe(NulFormat);
        MemoFormatter("").ShouldBe(NulFormat);
        MemoFormatter("12").ShouldBe("12");
      }
      // should parse
      {
        MemoParser(null).ShouldBe((null, true, null));
        MemoParser("").ShouldBe(("", true, null));
        MemoParser("123-456").ShouldBe(("123-456", true, null));
      }
      // should parse: maxNonWhiteSpaceLength
      {
        var param = new { maxNonWhiteSpaceLength = 4 }.ToParam();
        MemoParser("12345", param).ShouldBe(("12345", false, null));
        MemoParser("12 3 45", param).ShouldBe(("12 3 45", false, null));
        MemoParser("12  3 4", param).ShouldBe(("12  3 4", true, null));
      }
      // should parse: maxLines
      {
        var param = new { maxLines = 2 }.ToParam();
        MemoParser("1\n2\n3", param).ShouldBe(("1\n2\n3", false, null));
        MemoParser("1\n2", param).ShouldBe(("1\n2", true, null));
      }
    }

    [Fact]
    public void Regex()
    {
      // should format
      {
        RegexFormatter(null).ShouldBe(NulFormat);
        RegexFormatter("").ShouldBe(NulFormat);
        RegexFormatter("12").ShouldBe("12");
      }
      // should parse
      {
        RegexParser(null).ShouldBe((null, true, null));
        RegexParser("").ShouldBe(("", true, null));
        RegexParser("123-456").ShouldBe(("123-456", true, null));
      }
      // should parse: pattern
      {
        var param = new { pattern = @"^((0[1-9])|(1[0-2]))[\/-](([0-2][0-9])|([3][0-1]))$" }.ToParam();
        RegexParser("2017-01-01", param).ShouldBe(("2017-01-01", false, null));
        RegexParser("09-12", param).ShouldBe(("09-12", true, null));
      }
    }
  }
}
