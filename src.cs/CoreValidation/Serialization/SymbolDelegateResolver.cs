using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace CoreValidation.Serialization
{
  public interface ISymbolDelegateResolver
  {
    Delegate FindDelegate(string symbol);
  }

  class SymbolDelegateResolver : ISymbolDelegateResolver
  {
    readonly Dictionary<string, Delegate> _lookup = new Dictionary<string, Delegate>();

    public SymbolDelegateResolver(params Assembly[] assemblies) => _lookup = CreateLookup(assemblies);

    public Delegate FindDelegate(string symbol) => _lookup.TryGetValue(symbol, out var z) ? z : null;

    Dictionary<string, Delegate> CreateLookup(Assembly[] assemblies)
    {
      var lookup = new Dictionary<string, Delegate>();
      assemblies
          .SelectMany(a => a.ExportedTypes)
          .SelectMany(x => x.GetFields())
          .Select(x => new { field = x, symbol = x.GetCustomAttribute<SymbolAttribute>()?.TypeIdentifier })
          .Where(x => x.symbol != null)
          .ToList()
          .ForEach(x => lookup[x.symbol] = x.field.GetValue(null) as Delegate);
      assemblies
          .SelectMany(a => a.ExportedTypes)
          .SelectMany(x => x.GetProperties())
          .Select(x => new { property = x, symbol = x.GetCustomAttribute<SymbolAttribute>()?.TypeIdentifier })
          .Where(x => x.symbol != null)
          .ToList()
          .ForEach(x => lookup[x.symbol] = x.property.GetValue(null) as Delegate);
      return lookup;
    }
  }
}
