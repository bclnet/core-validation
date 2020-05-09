using System.Collections.Generic;

namespace CoreValidation
{
  public static class Globals
  {
    public static string NulFormat = string.Empty;
    public static readonly IDictionary<string, IDictionary<string, object>> Params = new Dictionary<string, IDictionary<string, object>>();
  }
}
