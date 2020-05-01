using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using static CoreValidation.Globals;

namespace CoreValidation.Formats
{
  public static class Internet
  {
    //const string _emailFragment = @"[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x41-\x5A\x5E-\x7C]";
    //readonly string _emailPattern2 = $@"^{_emailFragment}(\.{_emailFragment}+)*\@{_emailFragment}+(\.{_emailFragment}+)*$";
    //const string _hostnamePattern2 = @"^(?:([left-zA-Z0-9](?:[left-zA-Z0-9\-]{0,61}[left-zA-Z0-9])?\.)+([left-zA-Z]{2,6})(:\d{1,5})?)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?)?$";
    static readonly Regex _emailPattern = new Regex(@"^(([^<>()\[\]\\.,;:\s@""]+(\.[^<>()\[\]\\.,;:\s@""]+)*)|("".+""))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Singleline);
    static readonly Regex _hostnamePattern = new Regex(@"^(?:([a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+([a-zA-Z]{2,6})(:\d{1,5})?)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?)$", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Singleline);

    // email
    public static string EmailFormater(object value, IDictionary<string, object> param = null)
    {
      if (value == null) return NulFormat;
      return value.ToString();
    }
    public static (object, bool, Func<object>) EmailParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      if (!_emailPattern.IsMatch(text)) return (text, false, error);
      return (text, true, error);
    }

    // emailList
    public static string EmailListFormater(object value, IDictionary<string, object> param = null)
    {
      if (value == null) return NulFormat;
      return value.ToString();
    }
    public static (object, bool, Func<object>) EmailListParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      var list = text.Split(',', ';'); var newList = new List<string>();
      foreach (var v in list)
      {
        var v2 = v.Trim(); if (v2.Length == 0) continue;
        if (!_emailPattern.IsMatch(v2)) return (text, false, error);
        newList.Add(v2);
      }
      var value = string.Join("; ", newList);
      if (param != null)
      { // check param
        if (param.TryGetValue("maxCount", out var z) && z is int maxCount) { if (maxCount != 0 && newList.Count > maxCount) return (text, false, error); }
      }
      return (value, true, error);
    }

    // hostname
    public static string HostnameFormater(object value, IDictionary<string, object> param = null)
    {
      if (value == null) return NulFormat;
      return value.ToString();
    }
    public static (object, bool, Func<object>) HostnameParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      if (!_hostnamePattern.IsMatch(text)) return (text, false, error);
      return (text, true, error);
    }

    // hostnameList
    public static string HostnameListFormater(object value, IDictionary<string, object> param = null)
    {
      if (value == null) return NulFormat;
      return value.ToString();
    }
    public static (object, bool, Func<object>) HostnameListParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      var list = text.Split(',', ';'); var newList = new List<string>();
      foreach (var v in list)
      {
        var v2 = v.Trim(); if (v2.Length == 0) continue;
        if (!_hostnamePattern.IsMatch(v2)) return (text, false, error);
        newList.Add(v2);
      }
      var value = string.Join("; ", newList);
      if (param != null)
      { // check param
        if (param.TryGetValue("maxCount", out var z) && z is int maxCount) { if (maxCount != 0 && newList.Count > maxCount) return (text, false, error); }
      }
      return (value, true, error);
    }

    // uri
    public static string UriFormater(object value, IDictionary<string, object> param = null)
    {
      if (value == null) return NulFormat;
      return value.ToString();
    }
    public static (object, bool, Func<object>) UriParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      return (text, true, error);
    }

    // xml
    public static string XmlFormater(object value, IDictionary<string, object> param = null)
    {
      if (value == null) return NulFormat;
      return value.ToString();
    }
    public static (object, bool, Func<object>) XmlParser(string text, IDictionary<string, object> param = null, Func<object> error = null)
    {
      if (string.IsNullOrEmpty(text)) return (text, true, error);
      return (text, true, error);
    }
  }
}

