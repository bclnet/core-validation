using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CoreValidation.Serialization
{
  class CoreJsonConverter : JsonConverter
  {
    readonly ISymbolDelegateResolver _symbolDelegateResolver;
    bool _isInsideRead;
    JsonReader _reader;

    public CoreJsonConverter(ISymbolDelegateResolver symbolDelegateResolver) => _symbolDelegateResolver = symbolDelegateResolver;

    public override bool CanRead => !_isInsideRead || !string.IsNullOrEmpty(_reader.Path);

    public sealed override bool CanWrite => false;

    public override bool CanConvert(Type objectType) => true;

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) => throw new NotImplementedException();

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
      while (reader.TokenType == JsonToken.Comment)
        reader.Read();

      switch (reader.TokenType)
      {
        case JsonToken.Null: return null;
        case JsonToken.StartObject:
          return objectType != typeof(VRule)
            ? ReadObject(reader, objectType, serializer)
            : ReadRuleObject(reader, objectType, serializer);
        case JsonToken.StartArray:
          return objectType != typeof(VRule)
            ? ReadArray(reader, objectType, serializer)
            : ReadRuleArray(reader, objectType, serializer);
        default: return ReadInner(CreateAnotherReader(JToken.Load(reader), reader), objectType, serializer);
      }
    }

    object ReadArray(JsonReader reader, Type targetType, JsonSerializer serializer)
    {
      if (targetType == typeof(object))
        targetType = typeof(object[]);
      var elementType = GetElementType(targetType);
      var list = CreateCompatibleList(targetType, elementType);

      while (reader.Read() && reader.TokenType != JsonToken.EndArray)
        list.Add(ReadJson(reader, elementType, null, serializer));

      if (targetType.IsArray)
      {
        var array = Array.CreateInstance(targetType.GetElementType(), list.Count);
        list.CopyTo(array, 0);
        list = array;
      }

      return list;
    }

    static IList CreateCompatibleList(Type targetContainerType, Type elementType) =>
       targetContainerType.IsArray || targetContainerType.GetTypeInfo().IsAbstract
           ? (IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(elementType))
           : (IList)Activator.CreateInstance(targetContainerType);

    static Type GetElementType(Type arrayOrGenericContainer) =>
        arrayOrGenericContainer.IsArray
            ? arrayOrGenericContainer.GetElementType()
            : arrayOrGenericContainer.GenericTypeArguments[0];

    object ReadObject(JsonReader reader, Type objectType, JsonSerializer serializer)
    {
      var jObject = JObject.Load(reader);
      var targetType = typeof(Dictionary<string, object>);
      return ReadInner(CreateAnotherReader(jObject, reader), targetType, serializer);
    }

    static JsonReader CreateAnotherReader(JToken jObject, JsonReader reader)
    {
      var jObjectReader = jObject.CreateReader();
      jObjectReader.Culture = reader.Culture;
      jObjectReader.CloseInput = reader.CloseInput;
      jObjectReader.SupportMultipleContent = reader.SupportMultipleContent;
      jObjectReader.DateTimeZoneHandling = reader.DateTimeZoneHandling;
      jObjectReader.FloatParseHandling = reader.FloatParseHandling;
      jObjectReader.DateFormatString = reader.DateFormatString;
      jObjectReader.DateParseHandling = reader.DateParseHandling;
      return jObjectReader;
    }

    object ReadInner(JsonReader reader, Type objectType, JsonSerializer serializer)
    {
      _reader = reader;
      _isInsideRead = true;
      try { return serializer.Deserialize(reader, objectType); }
      catch { return DefaultValue(objectType); }
      finally { _isInsideRead = false; }
    }

    static object DefaultValue(Type type) =>
      type.GetTypeInfo().IsValueType
         ? Activator.CreateInstance(type)
         : null;

    object ReadRuleObject(JsonReader reader, Type objectType, JsonSerializer serializer)
    {
      var jObject = JObject.Load(reader);
      var ruleProperty = jObject.Properties().FirstOrDefault();
      if (ruleProperty == null)
        throw new InvalidOperationException("Rule property missing");
      var rulePropertyName = ruleProperty.Name;
      if (string.Equals(rulePropertyName, "rule", StringComparison.OrdinalIgnoreCase))
        return (VRule)ReadInner(CreateAnotherReader(ruleProperty.Value, reader), typeof(VRule), serializer);
      if (string.Equals(rulePropertyName, "ruleIf", StringComparison.OrdinalIgnoreCase))
        return (VRule)ReadInner(CreateAnotherReader(ruleProperty.Value, reader), typeof(VRuleIf), serializer);
      throw new ArgumentOutOfRangeException();
    }

    object ReadRuleArray(JsonReader reader, Type objectType, JsonSerializer serializer)
    {
      var field = (string)null;
      var label = (string)null;
      var args = new List<V.Symbol>();
      var state = new Dictionary<string, object>();
      var idx = 0;
      while (reader.Read() && reader.TokenType != JsonToken.EndArray)
      {
        var node = ReadJson(reader, typeof(object), null, serializer);
        switch (idx++)
        {
          case 0: field = node?.ToString(); break;
          case 1: label = node?.ToString(); break;
          default:
            if (node == null)
              break;
            if (node is Dictionary<string, object> s)
            {
              state.Assign(s);
              break;
            }
            var n = node is object[] z ? z : new[] { node };
            if (n.Length > 0 && (n[0] is string symbolType))
            {
              var args2 = n.Length > 1 ? new object[n.Length - 1] : null;
              if (args2 != null)
                Array.Copy(n, 1, args2, 0, args2.Length);
              args.Add(GetSymbol(symbolType, args2));
            }
            break;
        }
      }
      return new VRule(field, label, args, state);
    }

    V.Symbol GetSymbol(string symbol, object[] args)
    {
      var d = _symbolDelegateResolver.FindDelegate(symbol);
      if (d == null)
        throw new InvalidOperationException($"Unable to find delagate for '{symbol}'");
      var parameters = d.Method.GetParameters();
      var newArgs = parameters.Select(x => x.DefaultValue).ToArray();
      if (args != null)
        for (var i = 0; i < args.Length && i < parameters.Length; i++)
          newArgs[i] = Convert.ChangeType(args[i], parameters[i].ParameterType);
      var result = d.DynamicInvoke(newArgs) as V.Symbol;
      return result;
    }
  }
}
