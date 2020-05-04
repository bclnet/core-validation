using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using static CoreValidation.Formats.Internet;
using static CoreValidation.Formats.Logistics;
using static CoreValidation.Formats.Moment;
using static CoreValidation.Formats.Number;
using static CoreValidation.Formats.String;

namespace CoreValidation
{
  public static class V
  {
    public class Symbol
    {
      public Func<string> format = () => null;
      public Func<object> parse = () => null;
    }

    public static IDictionary<string, object> ToParam(this object source, BindingFlags bindingAttr = BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.Instance) =>
      source?.GetType().GetProperties(bindingAttr).ToDictionary(x => x.Name, x => x.GetValue(source, null));
    public static IDictionary<string, object> Assign(this IDictionary<string, object> source, object param, BindingFlags bindingAttr = BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.Instance) =>
      param?.ToParam(bindingAttr).Aggregate(source, (a, b) => { a[b.Key] = b.Value; return a; });

    static object MakeSymbol(string name, Func<string, Symbol> symbol)
    {
      //symbol.N = name;
      //symbol.Parse = (text, defaultValue) => { let v = symbol(text).parse(); return v[1] ? v[0] : defaultValue; }
      //symbol.ParseInfo = (text) => symbol(text).parse();
      //symbol.Format = (text) => symbol(text).format();
      return symbol;
    }

    static object MakeSymbol(string name, Func<string, IDictionary<string, object>, Symbol> symbol)
    {
      //symbol.N = name;
      //symbol.Parse = (text, defaultValue) => { let v = symbol(text).parse(); return v[1] ? v[0] : defaultValue; }
      //symbol.ParseInfo = (text) => symbol(text).parse();
      //symbol.Format = (text) => symbol(text).format();
      return symbol;
    }

    static IDictionary<string, object> MakeParm(string name, object param)
    {
      var global = Globals.Params.TryGetValue(name, out var z) ? z : null;
      var local = param != null ? ToParam(param) : null;
      return global == null ? local : local == null ? global : global.Aggregate(local, (a, b) => { a[b.Key] = b.Value; return a; });
    }

    static Func<string, string> MakeError(object customError, Func<string, string> defaultError) => defaultError;

    // options
    public static void SetParam(string name, object param) { if (param != null) Globals.Params[name] = param?.ToParam(); else Globals.Params.Remove(name); }
    static (object, bool, Func<object>) NulParser(string text, bool parsed, Func<object> error) => (text, true, error);

    // error messages
    public static readonly Func<string, string> RequiredError = (fieldName) => $"{fieldName} is required";
    public static readonly Func<string, string> GeneralError = (fieldName) => $"{fieldName} is invalid";
    public static readonly Func<string, string> InvalidFormatError = (fieldName) => $"{fieldName} has an invalid format";
    public static readonly Func<string, Func<string, string>> MustMatchError = (otherFieldName) => (fieldName) => $"{fieldName} must match {otherFieldName}";
    public static readonly Func<int, Func<string, string>> MinLengthError = (length) => (fieldName) => $"{fieldName} must be at least {length} characters";
    public static readonly Func<int, Func<string, string>> MaxLengthError = (length) => (fieldName) => $"{fieldName} must be at most {length} characters";

    // rules
    public static readonly Func<object, object> Required = (customError) => MakeSymbol("required", (text) => new Symbol { format = () => null, parse = () => NulParser(text, text != null && text.Length != 0, () => MakeError(customError, RequiredError)) });
    public static readonly Func<object, object, Func<string, object, object, bool>, object> Custom = (param, customError, predicate) => MakeSymbol("custom", (text, state) => new Symbol { format = () => null, parse = () => NulParser(text, predicate(text, state, param), () => MakeError(customError, GeneralError)) });
    public static readonly Func<string, string, object, object> MustMatch = (field, fieldName, customError) => MakeSymbol("mustMatch", (text, state) => new Symbol { format = () => null, parse = () => NulParser(text, state[field].ToString() == text, () => MakeError(customError, MustMatchError(fieldName))) });
    public static readonly Func<int, object, object> MinLength = (length, customError) => MakeSymbol("minLength", (text) => new Symbol { format = () => null, parse = () => NulParser(text, text != null && text.Length >= length, () => MakeError(customError, MinLengthError(length))) });
    public static readonly Func<int, object, object> MaxLength = (length, customError) => MakeSymbol("maxLength", (text) => new Symbol { format = () => null, parse = () => NulParser(text, (text == null || text.Length <= length), () => MakeError(customError, MaxLengthError(length))) });

    // formats - internet
    public static readonly Func<object, object, object> Email = (param, customError) => MakeSymbol("email", (text) => new Symbol { format = () => EmailFormatter(text, MakeParm("email", param)), parse = () => EmailParser(text, MakeParm("email", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> EmailList = (param, customError) => MakeSymbol("emailList", (text) => new Symbol { format = () => EmailListFormatter(text, MakeParm("emailList", param)), parse = () => EmailListParser(text, MakeParm("emailList", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Hostname = (param, customError) => MakeSymbol("hostname", (text) => new Symbol { format = () => HostnameFormatter(text, MakeParm("hostname", param)), parse = () => HostnameParser(text, MakeParm("hostname", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> HostnameList = (param, customError) => MakeSymbol("hostnameList", (text) => new Symbol { format = () => HostnameListFormatter(text, MakeParm("hostnameList", param)), parse = () => HostnameListParser(text, MakeParm("hostnameList", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Uri = (param, customError) => MakeSymbol("uri", (text) => new Symbol { format = () => UriFormatter(text, MakeParm("uri", param)), parse = () => UriParser(text, MakeParm("uri", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Xml = (param, customError) => MakeSymbol("xml", (text) => new Symbol { format = () => XmlFormatter(text, MakeParm("xml", param)), parse = () => XmlParser(text, MakeParm("xml", param), () => MakeError(customError, InvalidFormatError)) });
    //makeSymbols(email, emailList, hostname, hostnameList, uri, xml);

    // formats - logistics
    public static readonly Func<object, object, object> Phone = (param, customError) => MakeSymbol("phone", (text) => new Symbol { format = () => PhoneFormatter(text, MakeParm("phone", param)), parse = () => PhoneParser(text, MakeParm("phone", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Zip = (param, customError) => MakeSymbol("zip", (text) => new Symbol { format = () => ZipFormatter(text, MakeParm("zip", param)), parse = () => ZipParser(text, MakeParm("zip", param), () => MakeError(customError, InvalidFormatError)) });
    //makeSymbols(phone, zip);

    // formats - moment
    public static readonly Func<object, object, object> Date = (param, customError) => MakeSymbol("date", (text) => new Symbol { format = () => DateFormatter(text, MakeParm("date", param)), parse = () => DateParser(text, MakeParm("date", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> DateTime = (param, customError) => MakeSymbol("dateTime", (text) => new Symbol { format = () => DateTimeFormatter(text, MakeParm("dateTime", param)), parse = () => DateTimeParser(text, MakeParm("dateTime", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> MonthAndDay = (param, customError) => MakeSymbol("monthAndDay", (text) => new Symbol { format = () => MonthAndDayFormatter(text, MakeParm("monthAndDay", param)), parse = () => MonthAndDayParser(text, MakeParm("monthAndDay", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Time = (param, customError) => MakeSymbol("time", (text) => new Symbol { format = () => TimeFormatter(text, MakeParm("time", param)), parse = () => TimeParser(text, MakeParm("time", param), () => MakeError(customError, InvalidFormatError)) });
    //makeSymbols(date, dateTime, monthAndDay, time);

    // formats - number
    public static readonly Func<object, object, object> Bool = (param, customError) => MakeSymbol("bool", (text) => new Symbol { format = () => BoolFormatter(text, MakeParm("bool", param)), parse = () => BoolParser(text, MakeParm("bool", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Decimal = (param, customError) => MakeSymbol("decimal", (text) => new Symbol { format = () => DecimalFormatter(text, MakeParm("decimal", param)), parse = () => DecimalParser(text, MakeParm("decimal", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Integer = (param, customError) => MakeSymbol("integer", (text) => new Symbol { format = () => IntegerFormatter(text, MakeParm("integer", param)), parse = () => IntegerParser(text, MakeParm("integer", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Real = (param, customError) => MakeSymbol("real", (text) => new Symbol { format = () => RealFormatter(text, MakeParm("real", param)), parse = () => RealParser(text, MakeParm("real", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Money = (param, customError) => MakeSymbol("money", (text) => new Symbol { format = () => MoneyFormatter(text, MakeParm("money", param)), parse = () => MoneyParser(text, MakeParm("money", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Percent = (param, customError) => MakeSymbol("percent", (text) => new Symbol { format = () => PercentFormatter(text, MakeParm("percent", param)), parse = () => PercentParser(text, MakeParm("percent", param), () => MakeError(customError, InvalidFormatError)) });
    //makeSymbols(bool, decimal, integer, real, money, percent);

    // formats - strings
    public static readonly Func<object, object, object> Text = (param, customError) => MakeSymbol("text", (text) => new Symbol { format = () => TextFormatter(text, MakeParm("text", param)), parse = () => TextParser(text, MakeParm("text", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Memo = (param, customError) => MakeSymbol("memo", (text) => new Symbol { format = () => MemoFormatter(text, MakeParm("memo", param)), parse = () => MemoParser(text, MakeParm("memo", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Func<object, object, object> Regex = (param, customError) => MakeSymbol("regex", (text) => new Symbol { format = () => RegexFormatter(text, MakeParm("regex", param)), parse = () => RegexParser(text, MakeParm("regex", param), () => MakeError(customError, InvalidFormatError)) });
    //makeSymbols(text, memo, regex);
  }
}
