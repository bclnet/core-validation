using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using static CoreValidation.Globals;

namespace CoreValidation.Formats
{
  public static class String
  {
    // text
    public static string TextFormater(object value, IDictionary<string, object> param = null)
    {
      if (value == null) return NulFormat;
      return value.ToString();
    }
    public static (object, bool, Func<object>) TextParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      return (text, true, error);
    }

    // memo
    public static string MemoFormater(object value, IDictionary<string, object> param = null)
    {
      if (value == null) return NulFormat;
      return value.ToString();
    }
    public static (object, bool, Func<object>) MemoParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      if (param != null)
      { // check param
        if (param.TryGetValue("maxNonWhiteSpaceLength", out var z) && z is int maxNonWhiteSpaceLength) { if (maxNonWhiteSpaceLength != 0 && text.Replace(" ", string.Empty).Length > maxNonWhiteSpaceLength) return (text, false, error); }
        if (param.TryGetValue("maxLines", out z) && z is int maxLines) { if (maxLines != 0 && text.Split('\n').Length > maxLines) return (text, false, error); }
      }
      return (text, true, error);
    }

    // regex
    public static string RegexFormater(object value, IDictionary<string, object> param = null)
    {
      if (value == null) return NulFormat;
      return value.ToString();
    }
    public static (object, bool, Func<object>) RegexParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      { // check param
        if (param.TryGetValue("pattern", out var z) && z is string pattern) { if (pattern != null && !new Regex(pattern, RegexOptions.IgnoreCase | RegexOptions.Singleline).IsMatch(text)) return (text, false, error); }
      }
      return (text, true, error);
    }
  }
}
