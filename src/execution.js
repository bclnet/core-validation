// execution
export const rule = (field, name, ...args) => {
  for (var i in args) {
    if (args[i].b) args[i] = args[i].b();
  }
  return {
    r: { field, name, args },
    v0: (state) => {
      for (let v of args) {
        let value = state[field], x = v(value, state).parse(), newValue = v(x[0], state).format();
        if (newValue && value !== newValue) {
          return { [field]: newValue };
        }
      }
      return null;
    },
    v1: (state) => {
      for (let v of args) {
        let value = state[field], x = v(value, state).parse();
        let messageFunc = x[2](x[1]);
        if (messageFunc) {
          return { [field]: messageFunc(name) };
        }
      }
      return null;
    },
    f: (state) => {
      for (let v of args) {
        let value = state[field], x = v(value, state).parse(), newValue = v(x[0], state).format();
        if (newValue && value !== newValue) {
          return { [field]: newValue };
        }
      }
      return null;
    }
  }
};
export const ruleIf = (condition, ...rules) => {
  return {
    c: (state) => typeof condition !== 'function' ? state[condition] : condition(state),
    r: rules
  }
};

export const find = (state, rules, field) => rules.reduce((a, x) =>
  a || (x.c ?
    (x.c(state) && x.r ? find(state, x.r, field) : null) :
    x.r.field == field ? x.r : null)
  , null);
export const flatten = (state, rules) => rules.reduce((a, x) => {
  a.push.apply(a, x.c ?
    (x.c(state) && x.r ? flatten(state, x.r) : []) :
    [x.r]); return a;
}, []);
export const valuedate = (state, rules, field) => rules.reduce((a, x) =>
  Object.assign(a, x.c ?
    (x.c(state) && x.r ? valuedate(state, x.r, field) : a) :
    !field || x.r.field == field ? x.v0(state) : null
  ), {});
export const validate = (state, rules, field) => rules.reduce((a, x) =>
  Object.assign(a, x.c ?
    (x.c(state) && x.r ? validate(state, x.r, field) : a) :
    !field || x.r.field == field ? x.v1(state) : null
  ), {});
export const format = (state, rules, field) => rules.reduce((a, x) =>
  Object.assign(a, x.c ?
    (x.c(state) && x.r ? format(state, x.r, field) : a) :
    !field || x.r.field == field ? x.f(state) : null
  ), {});
