using CoreValidation.Bindings;
using System;
using System.Collections.Generic;
using System.Linq;
using static CoreValidation.Formats.Internet;
using static CoreValidation.Formats.Logistics;
using static CoreValidation.Formats.Moment;
using static CoreValidation.Formats.Number;
using static CoreValidation.Formats.String;

namespace CoreValidation
{
  public static partial class V
  {
    public static IDictionary<string, object> MakeParm(string name, object param)
    {
      var global = Globals.Params.TryGetValue(name, out var z) ? z : null;
      var local = param != null ? ToParam(param) : null;
      return global == null ? local : local == null ? global : global.Aggregate(local, (a, b) => { a[b.Key] = b.Value; return a; });
    }

    public static Func<string, string> MakeError(object customError, Func<string, string> defaultError) => defaultError;

    // options
    public static void SetParam(string name, object param) { if (param != null) Globals.Params[name] = param?.ToParam(); else Globals.Params.Remove(name); }
    public static (object, bool, Func<object>) NulParser(string text, bool parsed, Func<object> error) => (text, true, error);

    // error messages
    public static readonly Func<string, string> RequiredError = (fieldName) => $"{fieldName} is required";
    public static readonly Func<string, string> GeneralError = (fieldName) => $"{fieldName} is invalid";
    public static readonly Func<string, string> InvalidFormatError = (fieldName) => $"{fieldName} has an invalid format";
    public static readonly Func<string, Func<string, string>> MustMatchError = (otherFieldName) => (fieldName) => $"{fieldName} must match {otherFieldName}";
    public static readonly Func<int, Func<string, string>> MinLengthError = (length) => (fieldName) => $"{fieldName} must be at least {length} characters";
    public static readonly Func<int, Func<string, string>> MaxLengthError = (length) => (fieldName) => $"{fieldName} must be at most {length} characters";

    // rules
    public static readonly Arg<object> Required = (customError) => new Symbol("required", (text) => new SymbolFunc { Format = () => null, Parse = () => NulParser(text, text != null && text.Length != 0, () => MakeError(customError, RequiredError)) });
    public static readonly Arg<Func<string, object, object, bool>, object, object> Custom = (predicate, customError, param) => new Symbol("custom", (text, state) => new SymbolFunc { Format = () => null, Parse = () => NulParser(text, predicate(text, state, param), () => MakeError(customError, GeneralError)) });
    public static readonly Arg<string, string, object> MustMatch = (field, fieldName, customError) => new Symbol("mustMatch", (text, state) => new SymbolFunc { Format = () => null, Parse = () => NulParser(text, state[field].ToString() == text, () => MakeError(customError, MustMatchError(fieldName))) });
    public static readonly Arg<int, object> MinLength = (length, customError) => new Symbol("minLength", (text) => new SymbolFunc { Format = () => null, Parse = () => NulParser(text, text != null && text.Length >= length, () => MakeError(customError, MinLengthError(length))) });
    public static readonly Arg<int, object> MaxLength = (length, customError) => new Symbol("maxLength", (text) => new SymbolFunc { Format = () => null, Parse = () => NulParser(text, (text == null || text.Length <= length), () => MakeError(customError, MaxLengthError(length))) });

    // formats - internet
    public static readonly Arg<object, object> Email = (param, customError) => new Symbol("email", (text) => new SymbolFunc { Format = () => EmailFormatter(text, MakeParm("email", param)), Parse = () => EmailParser(text, MakeParm("email", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> EmailList = (param, customError) => new Symbol("emailList", (text) => new SymbolFunc { Format = () => EmailListFormatter(text, MakeParm("emailList", param)), Parse = () => EmailListParser(text, MakeParm("emailList", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Hostname = (param, customError) => new Symbol("hostname", (text) => new SymbolFunc { Format = () => HostnameFormatter(text, MakeParm("hostname", param)), Parse = () => HostnameParser(text, MakeParm("hostname", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> HostnameList = (param, customError) => new Symbol("hostnameList", (text) => new SymbolFunc { Format = () => HostnameListFormatter(text, MakeParm("hostnameList", param)), Parse = () => HostnameListParser(text, MakeParm("hostnameList", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Uri = (param, customError) => new Symbol("uri", (text) => new SymbolFunc { Format = () => UriFormatter(text, MakeParm("uri", param)), Parse = () => UriParser(text, MakeParm("uri", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Xml = (param, customError) => new Symbol("xml", (text) => new SymbolFunc { Format = () => XmlFormatter(text, MakeParm("xml", param)), Parse = () => XmlParser(text, MakeParm("xml", param), () => MakeError(customError, InvalidFormatError)) });
    //makeSymbols(email, emailList, hostname, hostnameList, uri, xml);

    // formats - logistics
    public static readonly Arg<object, object> Phone = (param, customError) => new Symbol("phone", (text) => new SymbolFunc { Format = () => PhoneFormatter(text, MakeParm("phone", param)), Parse = () => PhoneParser(text, MakeParm("phone", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Zip = (param, customError) => new Symbol("zip", (text) => new SymbolFunc { Format = () => ZipFormatter(text, MakeParm("zip", param)), Parse = () => ZipParser(text, MakeParm("zip", param), () => MakeError(customError, InvalidFormatError)) });
    //makeSymbols(phone, zip);

    // formats - moment
    public static readonly Arg<object, object> Date = (param, customError) => new Symbol("date", (text) => new SymbolFunc { Format = () => DateFormatter(text, MakeParm("date", param)), Parse = () => DateParser(text, MakeParm("date", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> DateTime = (param, customError) => new Symbol("dateTime", (text) => new SymbolFunc { Format = () => DateTimeFormatter(text, MakeParm("dateTime", param)), Parse = () => DateTimeParser(text, MakeParm("dateTime", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> MonthAndDay = (param, customError) => new Symbol("monthAndDay", (text) => new SymbolFunc { Format = () => MonthAndDayFormatter(text, MakeParm("monthAndDay", param)), Parse = () => MonthAndDayParser(text, MakeParm("monthAndDay", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Time = (param, customError) => new Symbol("time", (text) => new SymbolFunc { Format = () => TimeFormatter(text, MakeParm("time", param)), Parse = () => TimeParser(text, MakeParm("time", param), () => MakeError(customError, InvalidFormatError)) });
    //makeSymbols(date, dateTime, monthAndDay, time);

    // formats - number
    public static readonly Arg<object, object> Bool = (param, customError) => new Symbol("bool", (text) => new SymbolFunc { Format = () => BoolFormatter(text, MakeParm("bool", param)), Parse = () => BoolParser(text, MakeParm("bool", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Decimal = (param, customError) => new Symbol("decimal", (text) => new SymbolFunc { Format = () => DecimalFormatter(text, MakeParm("decimal", param)), Parse = () => DecimalParser(text, MakeParm("decimal", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Integer = (param, customError) => new Symbol("integer", (text) => new SymbolFunc { Format = () => IntegerFormatter(text, MakeParm("integer", param)), Parse = () => IntegerParser(text, MakeParm("integer", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Real = (param, customError) => new Symbol("real", (text) => new SymbolFunc { Format = () => RealFormatter(text, MakeParm("real", param)), Parse = () => RealParser(text, MakeParm("real", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Money = (param, customError) => new Symbol("money", (text) => new SymbolFunc { Format = () => MoneyFormatter(text, MakeParm("money", param)), Parse = () => MoneyParser(text, MakeParm("money", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Percent = (param, customError) => new Symbol("percent", (text) => new SymbolFunc { Format = () => PercentFormatter(text, MakeParm("percent", param)), Parse = () => PercentParser(text, MakeParm("percent", param), () => MakeError(customError, InvalidFormatError)) });
    //makeSymbols(bool, decimal, integer, real, money, percent);

    // formats - strings
    public static readonly Arg<object, object> Text = (param, customError) => new Symbol("text", (text) => new SymbolFunc { Format = () => TextFormatter(text, MakeParm("text", param)), Parse = () => TextParser(text, MakeParm("text", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Memo = (param, customError) => new Symbol("memo", (text) => new SymbolFunc { Format = () => MemoFormatter(text, MakeParm("memo", param)), Parse = () => MemoParser(text, MakeParm("memo", param), () => MakeError(customError, InvalidFormatError)) });
    public static readonly Arg<object, object> Regex = (param, customError) => new Symbol("regex", (text) => new SymbolFunc { Format = () => RegexFormatter(text, MakeParm("regex", param)), Parse = () => RegexParser(text, MakeParm("regex", param), () => MakeError(customError, InvalidFormatError)) });
    //makeSymbols(text, memo, regex);

    // validator - default
    public static Validator Create(object @this, AbstractBinding binding = null) => new Validator(@this, binding);
  }
}
