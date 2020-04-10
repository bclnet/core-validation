/* istanbul ignore file */
// execution
import {
  find, flatten, valuedate, validate, format
} from './execution';

export const eventTargetInputParser = ($) => {
  if ($.length > 0 && $[0].target) {
    const { target } = $[0];
    return target.type === 'checkbox' ? target.checked : target.value;
  }
  return undefined;
};

export const objectInputParser = ($) => {
  if ($.length > 1 && $[1]) {
    const x = $[1];
    if (x.value !== undefined) return X.value;
    else if (x.checked !== undefined) return x.checked;
    else if (x.selection !== undefined) return x.selection;
    else if (x.formattedDate !== undefined) return x.formattedDate;
    else if (x.date !== undefined) return x.date;
    else { console.log('$', $); throw new Error(x); }
  }
  return inputParserEventTarget($);
};

// accessors
export const create = function (binding, defaultRules) {
  return ($this) => {
    return {
      // STATE
      $this,
      binding,
      defaultRules: null,
      inputParser: eventTargetInputParser,
      inputHandler: null,
      reset: function () {
        binding.setErrors($this, { _flag: 0 });
      },
      hasErrors: function (opts) {
        const skipRules = (opts || {}).skipRules || false;
        const errors = !skipRules ? this.runRules(opts, null, 1) : binding.getErrors($this);
        const primaryErrorFlag = errors._flag & 1;
        return primaryErrorFlag && Object.keys(errors).length !== 1;
      },
      hasErrorFlag: function (bit) {
        const errors = binding.getErrors($this);
        return errors._flag & (1 << bit);
      },
      setErrorFlag: function (bit) {
        const errors = binding.getErrors($this);
        errors._flag |= (1 << bit);
        binding.setErrors($this, errors);
      },
      clearErrorFlag: function (bit) {
        const errors = binding.getErrors($this);
        errors._flag &= ~(1 << bit);
        binding.setErrors($this, errors);
      },

      // RUN
      getRules: function (opts, field) {
        const rules = (opts || {}).rules || this.defaultRules || defaultRules;
        const state = binding.getState($this, opts);
        if (field) return rules ? find(state, rules, field) : null;
        return rules ? flatten(state, rules) : [];
      },
      getFormats: function (opts, field) {
        const rules = (opts || {}).rules || this.defaultRules || defaultRules;
        const state = binding.getState($this, opts);
        const values = rules ? format(state, rules, field) : {};
        if (field && state[field] === values[field]) return {};
        return values;
      },
      runRules: function (opts, field, flag) {
        const rules = (opts || {}).rules || this.defaultRules || defaultRules;
        const state = binding.getState($this, opts);
        const errors = rules ? validate(state, rules, field) : {};
        errors._flag = flag ? flag : binding.getErrors($this)._flag;
        binding.setErrors($this, errors);
        return errors;
      },
      runFormats: function (opts, field) {
        const rules = (opts || {}).rules || this.defaultRules || defaultRules;
        const state = binding.getState($this, opts);
        const values = rules ? format(state, rules, field) : {};
        if (field && state[field] === values[field]) return {};
        binding.setState($this, opts, values);
        return values;
      },
      reduceState: function (opts, exceptFields) {
        const state = binding.getState($this, opts);
        const fieldMap = this.getRules(opts).reduce((y, x) => Object.assign(y, { [x.field]: exceptFields ? exceptFields.includes(x.field) : true }), {});
        Object.keys(state).forEach(function (key) {
          if (!fieldMap[key] && (exceptFields ? !exceptFields.includes(key) : true)) {
            state[key] = '';
            //delete state[key];
          }
        });
        binding.setState($this, opts, state);
        return state;
      },

      // BINDERS
      labelFor: function (field, opts) {
        const rule = this.getRules(opts, field) || {};
        return rule.name || 'Label';
      },
      valueFor: function (field, opts) {
        const rule = this.getRules(opts, field) || {};
        const state = binding.getState($this, opts);
        let { defaultValue } = rule.state;
        if (defaultValue === undefined) defaultValue = '';
        return state[field] || defaultValue;
      },
      requiredFor: function (field, opts) {
        const rule = this.getRules(opts, field) || {};
        const required = rule.args && rule.args.some(x => x.n === 'required');
        return required;
      },
      errorFor: function (field, opts) {
        const errors = binding.getErrors($this);
        const primaryErrorFlag = errors._flag & 1;
        return primaryErrorFlag ? errors[field || ''] || '' : undefined;
      },
      formatFor: function (field, opts) {
        return this.getFormats(opts, field)[field];
      },
      inputFor: function (field, opts) {
        const inputParser = (opts || {}).inputParser || this.inputParser;
        const inputHandler = (opts || {}).inputHandler || this.inputHandler;
        if (!inputParser || !inputHandler) throw new Error('inputParser & inputHandler are required');
        return (...args) => {
          const value = inputParser(args);
          inputHandler(this, {
            id: field,
            value: value,
          });
        };
      },
      changeFor: function (field, opts) {
        const value = this.getFormats(opts, field)[field];
        return value ? {
          id: field,
          target: null,
          type: 'rule',
          value: value,
        } : undefined
      },
      onBlurFor: function (field, opts) {
        return () => { this.runFormats(opts, field); }
      },
    };
  };
};
