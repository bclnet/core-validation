using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace CoreValidation
{
  public static class RuleManager
  {
    public static ICollection<VRule> Parse(string text)
    {
      var serializer = JsonSerializer.Create();
      using (var r = new JsonTextReader(new StringReader(text)))
      {
        var x = serializer.Deserialize<VRule[]>(r);
        return x;
      }
    }
  }
}
