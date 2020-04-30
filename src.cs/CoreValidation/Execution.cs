//using System;
//using System.Collections.Generic;
//using System.Data;

//namespace CoreValidation
//{
//  public class TheRule
//  {
//    public string Field;
//    public string Name;
//    public object Args;
//    public Dictionary<string, object> State;

//    public object Validate(Dictionary<string, object> state)
//    {
//      foreach (var v in args)
//      {
//        if (v == null) continue;
//        var value = state[Field];
//        var x = v(value, state).parse();
//        var messageFunc = x[2](x[1]);
//        //        if (messageFunc) {
//        //          return { [field]: messageFunc(name) };
//        //}
//      }
//      return null;
//    }

//    public string Format(Dictionary<string, object> state)
//    {
//      foreach (var v in args)
//      {
//        if (v == null) continue;
//        var value = state[field];
//        var x = v(value, state).parse();
//        var newValue = v(x[0], state).format();
//        //if (newValue && value != newValue)
//        //{
//        //  return { [field]: newValue };
//        //}
//      }
//      return null;
//    }
//  }
//  }

//  public class Execution
//{
//  // execution
//  public static TheRule Rule(string field, string name, object args)
//  {
//    //    let state = { };
//    //for (let i in args)
//    //    {
//    //      if (args[i].b) args[i] = args[i].b();
//    //      else if (typeof args[i] !== 'function')
//    //      {
//    //        Object.assign(state, args[i]);
//    //        delete args[i];
//    //      }
//    //    }
//    return new TheRule
//    {
//      //r = { field, name, args, state },
//    };
//  }

//  public static object RuleIf(Func<bool> condition, params TheRule[] rules)
//  {
//    return new
//    {
//      //c: (state) => typeof condition !== 'function' ? state[condition] : condition(state),
//      //r: rules
//    };
//  }

//  //    export const find = (state, rules, field) => rules.reduce((a, x) =>
//  //  a || (x.c ?
//  //    (x.c(state) && x.r ? find(state, x.r, field) : null) :
//  //    x.r.field === field ? x.r : null)
//  //  , null);
//  //export const flatten = (state, rules) => rules.reduce((a, x) => {
//  //  a.push.apply(a, x.c ?
//  //    (x.c(state) && x.r ? flatten(state, x.r) : []) :
//  //    [x.r]); return a;
//  //}, []);
//  //export const validate = (state, rules, field) => rules.reduce((a, x) =>
//  //  Object.assign(a, x.c ?
//  //    (x.c(state) && x.r ? validate(state, x.r, field) : a) :
//  //    !field || x.r.field === field ? x.validate(state) : null
//  //  ), {});
//  //export const format = (state, rules, field) => rules.reduce((a, x) =>
//  //  Object.assign(a, x.c ?
//  //    (x.c(state) && x.r ? format(state, x.r, field) : a) :
//  //    !field || x.r.field === field ? x.format(state) : null
//  //  ), {});

//}
//}
