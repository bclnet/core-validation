/* istanbul ignore file */
// execution
export const rule = (field, name, ...args) => {
  let state = {};
  for (let i in args) {
    if (args[i].b) args[i] = args[i].b();
    else if (typeof args[i] !== 'function') {
      Object.assign(state, args[i]);
      delete args[i];
    }
  }
  return {
    r: { field, name, args, state },
    validate: (state) => {
      for (let v of args) {
        if (!v) continue;
        const value = state[field]
        const x = v(value, state).parse();
        const messageFunc = x[1] ? x[2]() : null;
        if (messageFunc)
          return { [field]: messageFunc(name) };
      }
      return null;
    },
    format: (state) => {
      for (let v of args) {
        if (!v) continue;
        const value = state[field];
        const x = v(value, state).parse();
        const newValue = v(x[0], state).format();
        if (newValue && value !== newValue)
          return { [field]: newValue };
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
    x.r.field === field ? x.r : null)
  , null);
export const flatten = (state, rules) => rules.reduce((a, x) => {
  a.push.apply(a, x.c ?
    (x.c(state) && x.r ? flatten(state, x.r) : []) :
    [x.r]); return a;
}, []);
export const validate = (state, rules, field) => rules.reduce((a, x) =>
  Object.assign(a, x.c ?
    (x.c(state) && x.r ? validate(state, x.r, field) : a) :
    !field || x.r.field === field ? x.validate(state) : null
  ), {});
export const format = (state, rules, field) => rules.reduce((a, x) =>
  Object.assign(a, x.c ?
    (x.c(state) && x.r ? format(state, x.r, field) : a) :
    !field || x.r.field === field ? x.format(state) : null
  ), {});
