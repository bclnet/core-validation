// execution
export {
  flatten, valuedate, validate, format
} from './execution';

// accessors
export let reset = function (ctx) {
  ctx.clearErrorFlag(1);
};

export let rules = function (ctx, stateProp, rules) {
  let state = ctx.getState(stateProp);
  return rules ? flatten(state, rules) : [];
};

export let runRules = function (ctx, rules, stateProp) {
  let state = ctx.getState(stateProp);
  let errors = rules ? validate(state, rules) : {};
  errors._showErrors = ($this.state.errors || { _showErrors: false })._showErrors;
  $this.setState({ errors });
  return errors;
};

export let reduceState = function (ctx, stateProp, rules, clearExceptFields) {
  let state = ctx.getState(stateProp);
  let effRules = rules(ctx, stateProp, rules);
  let fieldMap = effRules.reduce((y, x) => Object.assign(y, { [x.field]: clearExceptFields ? clearExceptFields.includes(x.field) : true }), {});
  Object.keys(state).forEach(function (key) {
    if (!fieldMap[key]) {
      state[key] = '';
      //delete state[key];
    }
  });
  return ctx.getState();
};

export let hasErrors = function (ctx, stateProp, rules) {
  if (rules) {
    runRules(ctx, stateProp, rules)
  }
  return ctx.hasErrors();
};

export let errorFor = function (ctx, field) {
  return ctx.errors()[field || ''] || '';
};




export let setValues = function ($this, rules, stateProp) {
  let state = stateProp ? $this.state[stateProp] : $this.state;
  let values = rules ? valuedate(state, rules) : {};
  if (stateProp) { for (let key in values) state[key] = values[key]; $this.setState({ [stateProp]: state }); }
  else $this.setState(values);
  return values;
};

export let setFormats = function ($this, rules, stateProp) {
  let state = stateProp ? $this.state[stateProp] : $this.state;
  let values = rules ? format(state, rules) : {};
  if (stateProp) { for (let key in values) state[key] = values[key]; $this.setState({ [stateProp]: state }); }
  else $this.setState(values);
  return values;
};

// export let parseFor = function ($this, rules, field) {
// 	let state = stateProp ? $this.state[stateProp] : $this.state;
// 	let oldValue = state[field] || '';
// 	let newValue = rules ? format(state, rules, field) : '';
// 	if (oldValue == newValue) {
// 		return;
// 	}
// 	if (stateProp) { }
// 	else $this.setState({ [field]: newValue });
// };
