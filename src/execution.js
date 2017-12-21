// execution
export const rule = (field, name, ...args) => {
  return {
    r: (state) => {
      return { field, name, args };
    },
    v0: (state) => {
      for (let v of args) {
        let value = state[field], x = v(0, value, state), newValue = v(1, x[0][0], state);
        if (newValue && value !== newValue) {
          return { [field]: newValue };
        }
      }
      return null;
    },
    v1: (state) => {
      for (let v of args) {
        let value = state[field], x = v(0, value, state);
        let messageFunc = x[1](x[0][1]);
        if (messageFunc) {
          return { [field]: messageFunc(name) };
        }
      }
      return null;
    },
    f: (state) => {
      for (let v of args) {
        let value = state[field], newValue = v(1, value, state);
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
export const flatten = (state, rules) => rules.reduce((y, x) => { y.push.apply(y, x.c ? (x.c(state) && x.r ? flatten(state, x.r) : []) : [x.r(state)]); return y; }, []);
export const valuedate = (state, rules) => rules.reduce((y, x) => Object.assign(y, x.c ? (x.c(state) && x.r ? valuedate(state, x.r) : y) : x.v0(state)), {});
export const validate = (state, rules) => rules.reduce((y, x) => Object.assign(y, x.c ? (x.c(state) && x.r ? validate(state, x.r) : y) : x.v1(state)), {});
export const format = (state, rules) => rules.reduce((y, x) => Object.assign(y, x.c ? (x.c(state) && x.r ? format(state, x.r) : y) : x.f(state)), {});
