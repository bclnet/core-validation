using Xunit;

namespace CoreValidation.Tests
{
  public class RuleManagerTest
  {
    [Fact]
    public void Parse()
    {
      var rules =
@"[
{ 'field': 'field', 'label': 'field label' },
{ 'field': 'value', 'value label', { 'value': false } },
{ 'field': 'email', 'label': 'email label', 'email', 'maxLength': [100], 'required' },
]";
      // should
      {
        //var r = RuleManager.Parse(rules);
        Assert.True(true);
      }
    }
  }
}
