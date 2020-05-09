using System;

namespace CoreValidation.Serialization
{
  [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, AllowMultiple = true, Inherited = false)]
  public class SymbolAttribute : Attribute
  {
    public string TypeIdentifier { get; }

    public SymbolAttribute(string typeIdentifier)
    {
      TypeIdentifier = typeIdentifier;
    }
  }
}
