using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;

namespace CoreValidation
{
  public class Rule
  {
    internal Rule() { }
    public Rule(string field, string label, V.Symbol[] args, IDictionary<string, object> state)
    {
      Field = field;
      Label = label;
      Args = args;
      State = state;
    }

    public readonly string Field;
    public readonly string Label;
    public readonly V.Symbol[] Args;
    public readonly IDictionary<string, object> State;

    internal IDictionary<string, object> Validate(IDictionary<string, object> state)
    {
      foreach (var v in Args)
      {
        if (v == null) continue;
        var value = state[Field].ToString();
        var x = v.Func(value, state).Parse();
        var error = x.Item2 ? x.Item3() : null;
        if (error is Func<string, object> errorFunc0)
          return new Dictionary<string, object> { { Field, errorFunc0(Label) } };
      }
      return null;
    }

    internal IDictionary<string, object> Format(IDictionary<string, object> state)
    {
      foreach (var v in Args)
      {
        if (v == null) continue;
        var value = state[Field].ToString();
        var x = v.Func(value, state).Parse();
        var newValue = v.Func(x.Item1.ToString(), state).Format();
        if (newValue != null && value != newValue)
          return new Dictionary<string, object> { { Field, newValue } };
      }
      return null;
    }
  }

  internal class RuleIf : Rule
  {
    public RuleIf(Func<IDictionary<string, object>, bool> condition, Rule[] rules)
    {
      Condition = condition;
      Rules = rules;
    }

    public readonly Func<IDictionary<string, object>, bool> Condition;
    public readonly Rule[] Rules;
  }

  public partial class V
  {
    public class SymbolFunc
    {
      public Func<string> Format = () => null;
      public Func<(object, bool, Func<object>)> Parse = () => (null, false, null);
    }

    public class Symbol
    {
      public Symbol(string name, Func<string, SymbolFunc> func)
      {
        Name = name;
        Func = (text, state) => func(text);
      }
      public Symbol(string name, Func<string, IDictionary<string, object>, SymbolFunc> func)
      {
        Name = name;
        Func = func;
      }
      public readonly string Name;
      public readonly Func<string, IDictionary<string, object>, SymbolFunc> Func;
    }

    public delegate Symbol Arg<in T1>(T1 arg1 = default);
    public delegate Symbol Arg<in T1, in T2>(T1 arg1 = default, T2 arg2 = default);
    public delegate Symbol Arg<in T1, in T2, in T3>(T1 arg1 = default, T2 arg2 = default, T3 arg3 = default);
    public delegate Symbol Arg<in T1, in T2, in T3, in T4>(T1 arg1 = default, T2 arg2 = default, T3 arg3 = default, T4 arg4 = default);

    public static IDictionary<string, object> ToParam(this object source, BindingFlags bindingAttr = BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.Instance) =>
      source?.GetType().GetProperties(bindingAttr).ToDictionary(x => x.Name, x => x.GetValue(source, null));
    public static IDictionary<string, object> Assign(this IDictionary<string, object> source, IDictionary<string, object> param) =>
      param?.Aggregate(source, (a, b) => { a[b.Key] = b.Value; return a; });
    public static IDictionary<string, object> Assign(this IDictionary<string, object> source, object param, BindingFlags bindingAttr = BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.Instance) =>
      param?.ToParam(bindingAttr).Aggregate(source, (a, b) => { a[b.Key] = b.Value; return a; });

    // execution
    public static Rule Rule(string field, string label, params object[] args)
    {
      var state = new Dictionary<string, object>();
      var symbols = new List<Symbol>();
      foreach (var arg in args)
        if (arg is Delegate d) symbols.Add(d.DynamicInvoke(d.Method.GetParameters().Select(x => x.DefaultValue).ToArray()) as Symbol);
        else if (arg is Symbol s) symbols.Add(s);
        else state.Assign(arg);
      return new Rule(field, label, symbols.ToArray(), state);
    }

    public static Rule RuleIf(string condition, params Rule[] rules) => new RuleIf(
      condition: (state) => state != null && state[condition] != null && ((state[condition] is string s && s.Length > 0) || (state[condition] is bool b && b)),
      rules: rules
    );
    public static Rule RuleIf(Func<IDictionary<string, object>, bool> condition, params Rule[] rules) => new RuleIf(
      condition: condition,
      rules: rules
    );

    public static Rule Find(IDictionary<string, object> state, Rule[] rules, string field) => rules.Aggregate((Rule)null, (a, x) =>
      a ?? (x is RuleIf c ?
      (c.Rules != null && c.Rules.Length > 0 && c.Condition(state) ? Find(state, c.Rules, field) : null) :
      x.Field == field ? x : null)
    );

    public static ICollection<Rule> Flatten(IDictionary<string, object> state, Rule[] rules) => rules.Aggregate(new List<Rule>(), (a, x) =>
    {
      a.AddRange(x is RuleIf c ?
        (c.Rules != null && c.Rules.Length > 0 && c.Condition(state) ? (List<Rule>)Flatten(state, c.Rules) : new List<Rule>()) :
        new List<Rule>(new[] { x }));
      return a;
    });

    internal static IDictionary<string, object> Validate(IDictionary<string, object> state, Rule[] rules, string field = null) => rules.Aggregate((IDictionary<string, object>)new Dictionary<string, object>(), (a, x) =>
      a.Assign(x is RuleIf c ?
        (c.Rules != null && c.Rules.Length > 0 && c.Condition(state) ? Validate(state, c.Rules, field) : a) :
        string.IsNullOrEmpty(field) || x.Field == field ? x.Validate(state) : null
      ));

    internal static IDictionary<string, object> Format(IDictionary<string, object> state, Rule[] rules, string field = null) => rules.Aggregate((IDictionary<string, object>)new Dictionary<string, object>(), (a, x) =>
      a.Assign(x is RuleIf c ?
        (c.Rules != null && c.Rules.Length > 0 && c.Condition(state) ? Format(state, c.Rules, field) : a) :
        string.IsNullOrEmpty(field) || x.Field == field ? x.Format(state) : null
      ));
  }
}
