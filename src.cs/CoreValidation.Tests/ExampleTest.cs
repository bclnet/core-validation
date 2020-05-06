using CoreValidation.Bindings;
using System.Collections.Generic;
using Xunit;

namespace CoreValidation.Tests
{
  public class ExampleTest : IStateBinding
  {
    public Dictionary<string, object> Errors { get; set; } = new Dictionary<string, object>();
    public Dictionary<string, object> State { get; set; } = new Dictionary<string, object>();

    [Fact]
    public void Rules()
    {
      var rules = new[] {
          V.Rule("field", "field label"),
          V.Rule("value", "value label", new { value = false }),
          V.Rule("email", "email label", V.Email, V.MaxLength(100), V.Required),
      };
      // should
      {
        var v = V.Create(this);
        v.Rules = rules;
        v.RunRules();
        //Assert.True(true);
      }
    }

    [Fact]
    public void Formatting()
    {
      // should format
      {
        var a = V.Decimal(1, 2);
        //V.Decimal.Format(100);
        Assert.True(true);
      }
    }
  }
}
