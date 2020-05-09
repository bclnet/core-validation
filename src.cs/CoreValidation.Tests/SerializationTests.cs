using Newtonsoft.Json;
using Shouldly;
using System.Collections.Generic;
using Xunit;

namespace CoreValidation.Tests
{
  public class SerializationTests
  {
    JsonSerializerSettings _sut = Default.JsonSettings();

    [Fact]
    public void Read_object()
    {
      // should parse
      {
        var result = JsonConvert.DeserializeObject<object>(@"{ 'key': 'value', 'key2': 'value2' }", _sut) as IDictionary<string, object>;
        result.ShouldNotBeNull();
        result.Count.ShouldBe(2);
        result.ContainsKey("key").ShouldBeTrue();
      }
    }

    [Fact]
    public void Read_rule()
    {
      // should parse single rule
      {
        var rule = @"{'rule': ['name', 'label', 'email']}";
        var result = JsonConvert.DeserializeObject<VRule>(rule, _sut);
        result.ShouldNotBeNull();
        result.Field.ShouldBe("name");
        result.Label.ShouldBe("label");
        result.Args.Count.ShouldBe(1);
        result.State.Count.ShouldBe(0);
        //
        rule = @"{'rule': ['name', 'label', { 'value': false }]}";
        result = JsonConvert.DeserializeObject<VRule>(rule, _sut);
        result.ShouldNotBeNull();
        result.Field.ShouldBe("name");
        result.Label.ShouldBe("label");
        result.Args.Count.ShouldBe(0);
        result.State.Count.ShouldBe(1);
      }
      // should parse muliple rules
      {
        var rules =
@"[
{'rule': ['field', 'field label']},
{'rule': ['value', 'value label', { 'value': false }]},
{'rule': ['email', 'email label', 'email', ['maxLength', 100], 'required']},
]";
        var result = JsonConvert.DeserializeObject<VRule[]>(rules, _sut);
        result.Length.ShouldBe(3);
      }
    }

    [Fact]
    public void Read_rules()
    {
    }
  }
}
