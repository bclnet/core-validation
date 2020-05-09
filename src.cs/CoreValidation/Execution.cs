using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace CoreValidation
{
  public class VRule
  {
    internal VRule()
    {
      Args = new List<V.Symbol>();
      State = new Dictionary<string, object>();
    }
    public VRule(string field, string label, List<V.Symbol> args = null, IDictionary<string, object> state = null)
    {
      Field = field;
      Label = label;
      Args = args ?? new List<V.Symbol>();
      State = state ?? new Dictionary<string, object>();
    }

    public readonly string Field;
    public readonly string Label;
    public readonly List<V.Symbol> Args;
    public readonly IDictionary<string, object> State;

    internal IDictionary<string, object> Validate(IDictionary<string, object> state)
    {
      foreach (var v in Args)
      {
        if (v == null) continue;
        var value = state.TryGetValue(Field, out var z) ? z.ToString() : null;
        var x = v.Func(value, state).Parse();
        var error = x.Item2 ? null : x.Item3();
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
        var value = state.TryGetValue(Field, out var z) ? z.ToString() : null;
        var x = v.Func(value, state).Parse();
        var newValue = v.Func(x.Item1.ToString(), state).Format();
        if (newValue != null && value != newValue)
          return new Dictionary<string, object> { { Field, newValue } };
      }
      return null;
    }
  }

  internal class VRuleIf : VRule
  {
    public VRuleIf(Func<IDictionary<string, object>, bool> condition, VRule[] rules)
    {
      Condition = condition;
      Rules = rules;
    }

    public readonly Func<IDictionary<string, object>, bool> Condition;
    public readonly VRule[] Rules;
  }

  public partial class V
  {
    public class SymbolFunc
    {
      public Func<string> Format;
      public Func<(object, bool, Func<object>)> Parse;
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
      param != null ? param.Aggregate(source, (a, b) => { a[b.Key] = b.Value; return a; }) : source;
    public static IDictionary<string, object> Assign(this IDictionary<string, object> source, object param, BindingFlags bindingAttr = BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.Instance) =>
      param != null ? param.ToParam(bindingAttr).Aggregate(source, (a, b) => { a[b.Key] = b.Value; return a; }) : source;

    // execution
    public static VRule Rule(string field, string label, params object[] args)
    {
      var rule = new VRule(field, label);
      var symbols = rule.Args;
      if (args != null)
        foreach (var arg in args)
          if (arg is Delegate d) symbols.Add(d.DynamicInvoke(d.Method.GetParameters().Select(x => x.DefaultValue).ToArray()) as Symbol);
          else if (arg is Symbol s) symbols.Add(s);
          else rule.State.Assign(arg);
      return rule;
    }

    public static VRule RuleIf(string condition, params VRule[] rules) => new VRuleIf(
      condition: (state) => state != null && state.TryGetValue(condition, out var z) && ((z is string s && s.Length > 0) || (z is bool b && b)),
      rules: rules
    );
    public static VRule RuleIf(Func<IDictionary<string, object>, bool> condition, params VRule[] rules) => new VRuleIf(
      condition: condition,
      rules: rules
    );

    public static VRule Find(IDictionary<string, object> state, ICollection<VRule> rules, string field) => rules.Aggregate((VRule)null, (a, x) =>
      a ?? (x is VRuleIf c ?
      (c.Rules != null && c.Rules.Length > 0 && c.Condition(state) ? Find(state, c.Rules, field) : null) :
      x.Field == field ? x : null)
    );

    public static ICollection<VRule> Flatten(IDictionary<string, object> state, ICollection<VRule> rules) => rules.Aggregate(new List<VRule>(), (a, x) =>
    {
      a.AddRange(x is VRuleIf c ?
        (c.Rules != null && c.Rules.Length > 0 && c.Condition(state) ? (List<VRule>)Flatten(state, c.Rules) : new List<VRule>()) :
        new List<VRule>(new[] { x }));
      return a;
    });

    internal static IDictionary<string, object> Validate(IDictionary<string, object> state, ICollection<VRule> rules, string field = null) => rules.Aggregate((IDictionary<string, object>)new Dictionary<string, object>(), (a, x) =>
      a.Assign(x is VRuleIf c ?
        (c.Rules != null && c.Rules.Length > 0 && c.Condition(state) ? Validate(state, c.Rules, field) : a) :
        string.IsNullOrEmpty(field) || x.Field == field ? x.Validate(state) : null
      ));

    internal static IDictionary<string, object> Format(IDictionary<string, object> state, ICollection<VRule> rules, string field = null) => rules.Aggregate((IDictionary<string, object>)new Dictionary<string, object>(), (a, x) =>
      a.Assign(x is VRuleIf c ?
        (c.Rules != null && c.Rules.Length > 0 && c.Condition(state) ? Format(state, c.Rules, field) : a) :
        string.IsNullOrEmpty(field) || x.Field == field ? x.Format(state) : null
      ));
  }
}
