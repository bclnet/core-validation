using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.RegularExpressions;
using static CoreValidation.Globals;

namespace CoreValidation.Formats
{
  public static class Moment
  {
    const string DateFormatterDefault = "yyyy-MM-dd";
    const string DateTimeFormatterDefault = "yyyy-MM-dd h:mm tt";
    const string MonthAndDayFormatterDefault = "MM/dd";
    const string TimeFormatterDefault = "h:mm tt";

    static readonly DateTime _minDateValue = new DateTime(1753, 1, 1);
    static readonly DateTime _maxDateValue = new DateTime(3000, 1, 1);
    static readonly Regex _monthAndDayPattern = new Regex($"^((0[1-9])|(1[0-2]))[\\/-](([0-2][0-9])|([3][0-1]))$", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Singleline);

    // date
    public static string DateFormatter(object value, IDictionary<string, object> param = null)
    {
      if (value == null || (value is string h && h.Length == 0)) return NulFormat;
      var value_ = Convert.ToDateTime(value);
      if (param != null && param.TryGetValue("format", out var z) && z is string format)
        switch (format)
        {
          case "date": return value_.ToString("dd MMMM yyyy", CultureInfo.InvariantCulture);
          case "longDate": return value_.ToString("dddd, MMMM d, yyyy", CultureInfo.InvariantCulture);
          case "longDate2": return value_.ToString(value_.Year == DateTime.Today.Year ? "dddd, MMMM d" : "dddd, MMMM d, yyyy", CultureInfo.InvariantCulture);
          case "shortDate": return value_.ToString("d-MMM-yyyy", CultureInfo.InvariantCulture);
          case "shorterDate": return value_.ToString("MMM d yyyy", CultureInfo.InvariantCulture);
          case "monthDay": return value_.ToString("MMMM d", CultureInfo.InvariantCulture);
          case "monthYear": return value_.ToString("MMMM yyyy", CultureInfo.InvariantCulture);
          case "pattern": return param.TryGetValue("pattern", out z) && z is string pattern ? value_.ToString(pattern, CultureInfo.InvariantCulture) : string.Empty;
          default: throw new ArgumentOutOfRangeException(nameof(param), "param.format invalid");
        }
      return value_.ToString(DateFormatterDefault, CultureInfo.InvariantCulture);
    }
    public static (object, bool, Func<object>) DateParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      if (!TryDate(text, out var value)) return (text, false, error);
      if (value < _minDateValue || value > _maxDateValue) return (text, false, error);
      value = new DateTime(value.Year, value.Month, value.Day);
      if (param != null)
      { // check param
        if (param.TryGetValue("minValue", out var z) && z is DateTime minValue) { if (value < minValue) return (text, false, error); }
        if (param.TryGetValue("maxValue", out z) && z is DateTime maxValue) { if (value > maxValue) return (text, false, error); }
      }
      return (value, true, error);
    }

    // dateTime
    public static string DateTimeFormatter(object value, IDictionary<string, object> param = null)
    {
      if (value == null || (value is string h && h.Length == 0)) return NulFormat;
      var value_ = Convert.ToDateTime(value);
      if (param != null && param.TryGetValue("format", out var z) && z is string format)
        switch (format)
        {
          case "dateTime": return value_.ToString("dd MMMM yyyy h:mm tt", CultureInfo.InvariantCulture);
          case "longDateTime": return value_.ToString("dddd, MMMM d, yyyy h:mm tt", CultureInfo.InvariantCulture);
          case "longDate": return value_.ToString("dddd, MMMM d, yyyy", CultureInfo.InvariantCulture);
          case "longTime": return value_.ToString("hh:mm:ss tt", CultureInfo.InvariantCulture);
          case "shortDate": return value_.ToString("d-MMM-yyyy", CultureInfo.InvariantCulture);
          case "shorterDate": return value_.ToString("MMM d yyyy", CultureInfo.InvariantCulture);
          case "shortTime": return value_.ToString("h:mm tt", CultureInfo.InvariantCulture);
          case "tinyDate": return value_.ToString("M/d/yy", CultureInfo.InvariantCulture);
          case "tinyDateTime": return value_.ToString("M/d/yy h:mm tt", CultureInfo.InvariantCulture);
          case "pattern": return param.TryGetValue("pattern", out z) && z is string pattern ? value_.ToString(pattern, CultureInfo.InvariantCulture) : string.Empty;
          default: throw new ArgumentOutOfRangeException(nameof(param), "param.format invalid");
        }
      return value_.ToString(DateTimeFormatterDefault, CultureInfo.InvariantCulture);
    }
    public static (object, bool, Func<object>) DateTimeParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      if (!TryDateAndTime(text, out var value)) return (text, false, error);
      if (value < _minDateValue || value > _maxDateValue) return (text, false, error);
      if (param != null)
      { // check param
        if (param.TryGetValue("minValue", out var z) && z is DateTime minValue) { if (value < minValue) return (text, false, error); }
        if (param.TryGetValue("maxValue", out z) && z is DateTime maxValue) { if (value > maxValue) return (text, false, error); }
      }
      return (value, true, error);
    }

    // monthAndDay
    public static string MonthAndDayFormatter(object value, IDictionary<string, object> param = null)
    {
      if (value == null || (value is string h && h.Length == 0)) return NulFormat;
      var value_ = Convert.ToDateTime(value);
      if (param != null && param.TryGetValue("format", out var z) && z is string format)
        switch (format)
        {
          case "pattern": return param.TryGetValue("pattern", out z) && z is string pattern ? value_.ToString(pattern, CultureInfo.InvariantCulture) : string.Empty;
          default: throw new ArgumentOutOfRangeException(nameof(param), "param.format invalid");
        }
      return value_.ToString(MonthAndDayFormatterDefault, CultureInfo.InvariantCulture);
    }
    public static (object, bool, Func<object>) MonthAndDayParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      var match = _monthAndDayPattern.Match(text).Groups; if (match.Count != 7) return (text, false, error);
      var value = new DateTime(2000, int.Parse(match[1].Value), int.Parse(match[4].Value));
      return (value, true, error);
    }

    // time
    public static string TimeFormatter(object value, IDictionary<string, object> param = null)
    {
      if (value == null || (value is string h && h.Length == 0)) return NulFormat;
      var value_ = Convert.ToDateTime(value);
      if (param != null && param.TryGetValue("format", out var z) && z is string format)
        switch (format)
        {
          case "longTime": return value_.ToString("h:mm:ss tt", CultureInfo.InvariantCulture);
          case "shortTime": return value_.ToString("h:mm tt", CultureInfo.InvariantCulture);
          case "pattern": return param.TryGetValue("pattern", out z) && z is string pattern ? value_.ToString(pattern, CultureInfo.InvariantCulture) : string.Empty;
          default: throw new ArgumentOutOfRangeException(nameof(param), "param.format invalid");
        }
      return value_.ToString(TimeFormatterDefault, CultureInfo.InvariantCulture);
    }
    public static (object, bool, Func<object>) TimeParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      if (!TryTime(text, out var value)) return (text, false, error);
      value = new DateTime(2000, 1, 1, value.Hour, value.Minute, value.Second);
      if (param != null)
      { // check param
        if (param.TryGetValue("minValue", out var z) && z is DateTime minValue) { if (value < new DateTime(2000, 1, 1, minValue.Hour, minValue.Minute, minValue.Second)) return (text, false, error); }
        if (param.TryGetValue("maxValue", out z) && z is DateTime maxValue) { if (value > new DateTime(2000, 1, 1, maxValue.Hour, maxValue.Minute, maxValue.Second)) return (text, false, error); }
      }
      return (value, true, error);
    }

    static bool TryDate(string text, out DateTime value)
    {
      if (
        //text.IndexOf(":") != -1 ||
        //text.IndexOf("am", StringComparison.OrdinalIgnoreCase) != -1 ||
        //text.IndexOf("pm", StringComparison.OrdinalIgnoreCase) != -1 ||
        !DateTime.TryParse(text, out var z))
      {
        value = default; return false;
      }
      value = z.Date; return true;
    }

    static bool TryDateAndTime(string text, out DateTime value) => DateTime.TryParse(text, out value);

    static bool TryTime(string text, out DateTime value)
    {
      if (text.IndexOf(":") == -1 ||
        !DateTime.TryParse(text, out var z))
      {
        value = default; return false;
      }
      value = z; return true;
    }
  }
}
