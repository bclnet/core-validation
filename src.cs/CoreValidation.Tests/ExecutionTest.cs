using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace CoreValidation.Tests
{
  public class ExecutionTest
  {
    [Fact]
    public void Rule()
    {
      // should parse simple rules
      {
        var rules = new[] {
          V.Rule("field", "field label"),
          V.Rule("value", "value label", new { value = false }),
          V.Rule("required", "required label", V.Required),
          V.Rule("email", "email label", V.Email),
        };
        Assert2.Equal(rules.Length, 4);
        Assert2.Equal(rules[0].Field, "field"); Assert2.Equal(rules[0].Label, "field label"); Assert2.Equal(rules[0].Args.Length, 0); Assert2.Equal(rules[0].State.Count, 0);
        Assert2.Equal(rules[1].Field, "value"); Assert2.Equal(rules[1].Args.Length, 0); Assert2.Equal(rules[1].State.Count, 1);
        Assert2.Equal(rules[2].Field, "required"); Assert2.Equal(rules[2].Args.Length, 1); Assert2.Equal(rules[2].State.Count, 0);
        Assert2.Equal(rules[3].Field, "email"); Assert2.Equal(rules[3].Args.Length, 1); Assert2.Equal(rules[3].State.Count, 0);
      }
      // should parse complex rules
      {
        var rules = new[] {
          V.Rule("email", "email label", V.Email(new { maxValue = 10 }), V.MaxLength(100), V.Required),
        };
        Assert2.Equal(rules.Length, 1);
        Assert2.Equal(rules[0].Field, "email"); Assert2.Equal(rules[0].Label, "email label"); Assert2.Equal(rules[0].Args.Length, 3); Assert2.Equal(rules[0].State.Count, 0);
      }
      // should parse custom rule
      {
        var rules = new[] {
          V.Rule("field", "field label", V.Custom((a,b,c) => false, "Error")),
        };
        Assert2.Equal(rules.Length, 1);
        Assert2.Equal(rules[0].Args.Length, 1);
      }
    }

    [Fact]
    public void RuleIf()
    {
      // should parse conditional rule
      {
        var rules = new[] {
          V.Rule("field", "field label"),
          V.RuleIf("field",
            V.Rule("subField1", "subField1 label"),
            V.Rule("subField2", "subField2 label")
          ),
        };
        Assert2.Equal(rules.Length, 2);
      }
    }

    [Fact]
    public void Find()
    {
      // should find simple rule
      {
        var rules = new[] {
          V.Rule("field", "field label"),
        };
        Assert2.Equal(V.Find(null, rules, "nofield"), null);
        Assert2.Equal(V.Find(null, rules, "field").Field, "field");
      }
      // should find nested rule
      {
        var rules = new[] {
          V.Rule("field", "field label"),
          V.RuleIf("field",
            V.Rule("subField1", "subField1 label"),
            V.Rule("subField2", "subField2 label")
          ),
        };
        var state = new { field = false }.ToParam();
        Assert2.Equal(V.Find(state, rules, "subField1"), null);
        state = new { field = true }.ToParam();
        Assert2.Equal(V.Find(state, rules, "subField1").Field, "subField1");
      }
    }

    [Fact]
    public void Flatten()
    {
      // should flatten simple rule
      {
        var rules = new[] {
          V.Rule("field", "field label"),
        };
        Assert2.Equal(V.Flatten(null, rules).Count, 1);
      }
      // should flatten nested rule
      {
        var rules = new[] {
          V.Rule("field", "field label"),
          V.RuleIf("field",
            V.Rule("subField1", "subField1 label"),
            V.Rule("subField2", "subField2 label")
          ),
        };
        var state = new { field = false }.ToParam();
        Assert2.Equal(V.Flatten(state, rules).Count, 1);
        state = new { field = true }.ToParam();
        Assert2.Equal(V.Flatten(state, rules).Count, 3);
      }
    }

    //[Fact]
    //public void Validate()
    //{
    //  // should validate simple rule
    //  {
    //    var rules = new[] {
    //      V.Rule("field", "field label"),
    //    };
    //    Assert2.Equal(V.Validate(null, rules).Count, 1);
    //    Assert2.Equal(V.Validate(null, rules, "nofield").Count, 0);
    //    Assert2.Equal(V.Validate(null, rules, "field").Count, 1);
    //  }
    //  // should validate nested rule
    //  {
    //    var rules = new[] {
    //      V.Rule("field", "field label"),
    //      V.RuleIf("field",
    //        V.Rule("subField1", "subField1 label"),
    //        V.Rule("subField2", "subField2 label")
    //      ),
    //    };
    //    var state = new { field = false }.ToParam();
    //    Assert2.Equal(V.Validate(state, rules).Count, 0);
    //    state = new { field = true }.ToParam();
    //    Assert2.Equal(V.Validate(state, rules).Count, 0);
    //    Assert2.Equal(V.Validate(state, rules, "subField1").Count, 0);
    //  }
    //}

    //[Fact]
    //public void Format()
    //{
    //  // should find simple rule
    //  {
    //    var rules = new[] {
    //      V.Rule("field", "field label"),
    //    };
    //    Assert2.Equal(V.Format(null, rules).Count, 0);
    //    Assert2.Equal(V.Format(null, rules, "nofield").Count, 0);
    //    Assert2.Equal(V.Format(null, rules, "field").Count, 1);
    //  }
    //  // should find nested rule
    //  {
    //    var rules = new[] {
    //      V.Rule("field", "field label"),
    //      V.RuleIf("field",
    //        V.Rule("subField1", "subField1 label"),
    //        V.Rule("subField2", "subField2 label")
    //      ),
    //    };
    //    var state = new { field = false }.ToParam();
    //    Assert2.Equal(V.Format(state, rules).Count, 1);
    //    state = new { field = true }.ToParam();
    //    Assert2.Equal(V.Format(state, rules).Count, 3);
    //    Assert2.Equal(V.Format(state, rules, "subField1").Count, 1);
    //  }
    //}
  }
}
