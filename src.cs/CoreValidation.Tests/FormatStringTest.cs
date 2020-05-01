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
        Assert2.Equal(TextFormater(null), NulFormat);
        Assert2.Equal(TextFormater(""), NulFormat);
        Assert2.Equal(TextFormater("12"), "12");
      }
      // should parse
      {
        Assert2.Equal(TextParser(null), (null, true, null));
        Assert2.Equal(TextParser(""), ("", true, null));
        Assert2.Equal(TextParser("123-456"), ("123-456", true, null));
      }
    }

    [Fact]
    public void Memo()
    {
      // should format
      {
        Assert2.Equal(MemoFormater(null), NulFormat);
        Assert2.Equal(MemoFormater(""), NulFormat);
        Assert2.Equal(MemoFormater("12"), "12");
      }
      // should parse
      {
        Assert2.Equal(MemoParser(null), (null, true, null));
        Assert2.Equal(MemoParser(""), ("", true, null));
        Assert2.Equal(MemoParser("123-456"), ("123-456", true, null));
      }
      // should parse: maxNonWhiteSpaceLength
      {
        var param = new { maxNonWhiteSpaceLength = 4 }.ToParam();
        Assert2.Equal(MemoParser("12345", param), ("12345", false, null));
        Assert2.Equal(MemoParser("12 3 45", param), ("12 3 45", false, null));
        Assert2.Equal(MemoParser("12  3 4", param), ("12  3 4", true, null));
      }
      // should parse: maxLines
      {
        var param = new { maxLines = 2 }.ToParam();
        Assert2.Equal(MemoParser("1\n2\n3", param), ("1\n2\n3", false, null));
        Assert2.Equal(MemoParser("1\n2", param), ("1\n2", true, null));
      }
    }

    [Fact]
    public void Regex()
    {
      // should format
      {
        Assert2.Equal(RegexFormater(null), NulFormat);
        Assert2.Equal(RegexFormater(""), NulFormat);
        Assert2.Equal(RegexFormater("12"), "12");
      }
      // should parse
      {
        Assert2.Equal(RegexParser(null), (null, true, null));
        Assert2.Equal(RegexParser(""), ("", true, null));
        Assert2.Equal(RegexParser("123-456"), ("123-456", true, null));
      }
      // should parse: pattern
      {
        var param = new { pattern = @"^((0[1-9])|(1[0-2]))[\/-](([0-2][0-9])|([3][0-1]))$" }.ToParam();
        Assert2.Equal(RegexParser("2017-01-01", param), ("2017-01-01", false, null));
        Assert2.Equal(RegexParser("09-12", param), ("09-12", true, null));
      }
    }
  }
}
