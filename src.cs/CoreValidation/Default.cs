using CoreValidation.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System.Reflection;

namespace CoreValidation
{
  public class Default
  {
    public static JsonSerializerSettings JsonSettings(ISymbolDelegateResolver symbolDelegateResolver = null) => SerializerSettings(symbolDelegateResolver ?? SymbolDelegateResolver(AssembliesContainingSymbols));

    static JsonSerializerSettings SerializerSettings(ISymbolDelegateResolver symbolDelegateResolver)
    {
      return new JsonSerializerSettings
      {
        NullValueHandling = NullValueHandling.Ignore,
        Converters =
        {
            new CoreJsonConverter(symbolDelegateResolver),
            new IsoDateTimeConverter { DateTimeFormat = "YYYY-MM-DD" }
        }
      };
    }

    public static ISymbolDelegateResolver SymbolDelegateResolver(params Assembly[] assembliesContainingSymbols) => new SymbolDelegateResolver(assembliesContainingSymbols);

    public static Assembly[] AssembliesContainingSymbols { get; set; } = new[] { typeof(Default).GetTypeInfo().Assembly };
  }
}
