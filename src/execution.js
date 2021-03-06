/* istanbul ignore file */
// execution
export const rule = (field, label, ...args) => {
  let state = {};
  let symbols = [];
  for (let i in args) {
    let arg = args[i];
    if (arg.b) symbols.push(arg.b());
    else if (typeof arg !== 'function') Object.assign(state, arg);
    else symbols.push(arg);
  }
  args = symbols;
  return {
    r: { field, label, args, state },
    validate: (state) => {
      for (let v of args) {
        if (!v) continue;
        const value = state[field]
        const x = v(value, state).parse();
        const error = x[1] ? null : x[2]();
        if (error)
          return { [field]: error(label) };
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
    c: (state) => typeof condition !== 'function' ? !!state[condition] : condition(state),
    r: rules
  }
};

export const find = (state, rules, field) => rules.reduce((a, x) =>
  a || (x.c ?
    (x.r && x.c(state) ? find(state, x.r, field) : null) :
    x.r.field === field ? x.r : null)
  , null);

export const flatten = (state, rules) => rules.reduce((a, x) => {
  a.push.apply(a, x.c ?
    (x.r && x.c(state) ? flatten(state, x.r) : []) :
    [x.r]);
  return a;
}, []);

export const validate = (state, rules, field) => rules.reduce((a, x) =>
  Object.assign(a, x.c ?
    (x.r && x.c(state) ? validate(state, x.r, field) : a) :
    !field || x.r.field === field ? x.validate(state) : null
  ), {});

export const format = (state, rules, field) => rules.reduce((a, x) =>
  Object.assign(a, x.c ?
    (x.r && x.c(state) ? format(state, x.r, field) : a) :
    !field || x.r.field === field ? x.format(state) : null
  ), {});
