using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using static CoreValidation.Globals;

namespace CoreValidation.Formats
{
  public static class Logistics
  {
    static readonly Regex _notDigitsPattern = new Regex(@"\D", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Singleline);
    static readonly Regex _notAlphaDigitsPattern = new Regex(@"[^0-9a-z]", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Singleline);

    // phone
    public static string PhoneFormater(string value, IDictionary<string, object> param = null)
    {
      if (string.IsNullOrEmpty(value)) return NulFormat;
      return value;
    }
    public static (string, bool, Func<object>) PhoneParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      var countries = (param != null && param.TryGetValue("countries", out var z) && z is string v1 ? v1 : null) ?? "u";
      if (countries.Contains("u") || countries.Contains("c"))
      { // canada+usa/generic parsing
        var layout = (param != null && param.TryGetValue("layout", out z) && z is string v2 ? v2 : null) ?? "()";
        var ntext = _notDigitsPattern.Replace(text, string.Empty);
        if (ntext.Length >= 10) // 7
        {
          var v = new[] { ntext.Substring(0, 3), ntext.Substring(3, 6), ntext.Substring(6, 10), ntext.Length > 10 ? $" x{ntext.Substring(10)}" : string.Empty };
          switch (layout)
          {
            case ".": return ($"{v[0]}.{v[1]}.{v[2]}{v[3]}", true, error);
            case "-": return ($"{v[0]}-{v[1]}-{v[2]}{v[3]}", true, error);
            case "()": return ($"({v[0]}) {v[1]}-{v[2]}{v[3]}", true, error);
            default: throw new ArgumentOutOfRangeException(nameof(param), "param.layout invalid");
          }
        }
      }
      return (text, false, error);
    }

    // zip
    public static string ZipFormater(string value, IDictionary<string, object> param = null)
    {
      if (string.IsNullOrEmpty(value)) return NulFormat;
      return value;
    }
    public static (string, bool, Func<object>) ZipParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      var countries = (param != null && param.TryGetValue("countries", out var z) && z is string v1 ? v1 : "u") ?? "u";
      if (countries.Contains("c"))
      { // canada/generic parsing
        var ntext = _notAlphaDigitsPattern.Replace(text, string.Empty);
        if (ntext.Length == 6 &&
          char.IsLetter(ntext[0]) && char.IsDigit(ntext[1]) && char.IsLetter(ntext[2]) &&
          char.IsDigit(ntext[3]) && char.IsLetter(ntext[4]) && char.IsDigit(ntext[5])
        ) return ($"{ntext.Substring(0, 3)} {ntext.Substring(3)}", true, error);
      }
      if (countries.Contains("u"))
      { // usa/generic parsing
        var ntext = _notDigitsPattern.Replace(text, string.Empty);
        if (ntext.Length >= 7 && ntext.Length <= 9) return ($"{ntext.Substring(0, 5)}-{ntext.Substring(5).PadLeft(4, '0')}", true, error);
        else if (ntext.Length >= 3 && ntext.Length <= 5) return (ntext.PadLeft(5, '0'), true, error);
      }
      else if (countries == "*") return (text, true, error); // accept all
      return (text, false, error);
    }
  }
}
