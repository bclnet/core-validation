using Shouldly;
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
        rules.Length.ShouldBe(4);
        rules[0].Field.ShouldBe("field"); rules[0].Label.ShouldBe("field label"); rules[0].Args.Count.ShouldBe(0); rules[0].State.Count.ShouldBe(0);
        rules[1].Field.ShouldBe("value"); rules[1].Args.Count.ShouldBe(0); rules[1].State.Count.ShouldBe(1);
        rules[2].Field.ShouldBe("required"); rules[2].Args.Count.ShouldBe(1); rules[2].State.Count.ShouldBe(0);
        rules[3].Field.ShouldBe("email"); rules[3].Args.Count.ShouldBe(1); rules[3].State.Count.ShouldBe(0);
      }
      // should parse complex rules
      {
        var rules = new[] {
          V.Rule("email", "email label", V.Email(new { maxValue = 10 }), V.MaxLength(100), V.Required),
        };
        rules.Length.ShouldBe(1);
        rules[0].Field.ShouldBe("email"); rules[0].Label.ShouldBe("email label"); rules[0].Args.Count.ShouldBe(3); rules[0].State.Count.ShouldBe(0);
      }
      // should parse custom rule
      {
        var rules = new[] {
          V.Rule("field", "field label", V.Custom((a,b,c) => false, "Error")),
        };
        rules.Length.ShouldBe(1);
        rules[0].Args.Count.ShouldBe(1);
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
        rules.Length.ShouldBe(2);
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
        V.Find(null, rules, "nofield").ShouldBeNull();
        V.Find(null, rules, "field").Field.ShouldBe("field");
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
        V.Find(state, rules, "subField1").ShouldBeNull();
        state = new { field = true }.ToParam();
        V.Find(state, rules, "subField1").Field.ShouldBe("subField1");
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
        V.Flatten(null, rules).Count.ShouldBe(1);
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
        V.Flatten(state, rules).Count.ShouldBe(1);
        state = new { field = true }.ToParam();
        V.Flatten(state, rules).Count.ShouldBe(3);
      }
    }

    [Fact]
    public void Validate()
    {
      // should validate simple rule
      {
        var rules = new[] {
          V.Rule("field", "field label"),
        };
        V.Validate(null, rules).Count.ShouldBe(0);
        V.Validate(null, rules, "nofield").Count.ShouldBe(0);
        V.Validate(null, rules, "field").Count.ShouldBe(0);
      }
      // should validate nested rule
      {
        var rules = new[] {
          V.Rule("field", "field label"),
          V.RuleIf("field",
            V.Rule("subField1", "subField1 label"),
            V.Rule("subField2", "subField2 label")
          ),
        };
        var state = new { field = false }.ToParam();
        V.Validate(state, rules).Count.ShouldBe(0);
        state = new { field = true }.ToParam();
        V.Validate(state, rules).Count.ShouldBe(0);
        V.Validate(state, rules, "subField1").Count.ShouldBe(0);
      }
    }

    [Fact]
    public void Format()
    {
      // should find simple rule
      {
        var rules = new[] {
          V.Rule("field", "field label"),
        };
        V.Format(null, rules).Count.ShouldBe(0);
        V.Format(null, rules, "nofield").Count.ShouldBe(0);
        V.Format(null, rules, "field").Count.ShouldBe(0);
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
        V.Format(state, rules).Count.ShouldBe(0);
        state = new { field = true }.ToParam();
        V.Format(state, rules).Count.ShouldBe(0);
        V.Format(state, rules, "subField1").Count.ShouldBe(0);
      }
    }
  }
}
