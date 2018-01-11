// execution
import {
  find, flatten, valuedate, validate, format
} from './execution';

// accessors
export let create = function (binding, defaultRules) {
  return ($this) => {
    return {
      defaultRules: null,
      reset: function () {
        binding.setErrors($this, { _flag: 0 });
      },
      rules: function (opts, field) {
        let rules = (opts || {}).rules || this.defaultRules || defaultRules;
        let state = binding.getState($this, opts);
        if (field) return rules ? find(state, rules, field) : null;
        return rules ? flatten(state, rules) : [];
      },
      runRules: function (opts, field, flag) {
        let rules = (opts || {}).rules || this.defaultRules || defaultRules;
        let state = binding.getState($this, opts);
        let errors = rules ? validate(state, rules, field) : {};
        errors._flag = flag ? flag : binding.getErrors($this)._flag;
        binding.setErrors($this, errors);
        return errors;
      },
      runValues: function (opts, field) {
        let rules = (opts || {}).rules || this.defaultRules || defaultRules;
        let state = binding.getState($this, opts);
        let values = rules ? valuedate(state, rules, field) : {};
        binding.setState($this, opts, values);
        return values;
      },
      runFormats: function (opts, field) {
        let rules = (opts || {}).rules || this.defaultRules || defaultRules;
        let state = binding.getState($this, opts);
        let values = rules ? format(state, rules, field) : {};
        if (field && state[field] == values[field]) return;
        binding.setState($this, opts, values);
        return values;
      },
      reduceState: function (opts, clearExceptFields) {
        let state = binding.getState($this, opts);
        let fieldMap = this.rules(opts).reduce((y, x) => Object.assign(y, { [x.field]: clearExceptFields ? clearExceptFields.includes(x.field) : true }), {});
        Object.keys(state).forEach(function (key) {
          if (!fieldMap[key]) {
            state[key] = '';
            //delete state[key];
          }
        });
        binding.setState($this, opts, state);
        return state;
      },

      hasErrors: function (opts) {
        let skipRules = (opts || {}).skipRules || false;
        let errors = !skipRules ? this.runRules(opts, null, 1) : binding.getErrors($this);
        let primaryErrorFlag = errors._flag & 1;
        return primaryErrorFlag && Object.keys(errors).length !== 1;
      },

      hasErrorFlag: function (bit) {
        let errors = binding.getErrors($this);
        return errors._flag & (1 << bit);
      },
      setErrorFlag: function (bit) {
        let errors = binding.getErrors($this);
        errors._flag |= (1 << bit);
        binding.setErrors($this, errors);
      },
      clearErrorFlag: function (bit) {
        let errors = binding.getErrors($this);
        errors._flag &= ~(1 << bit);
        binding.setErrors($this, errors);
      },

      labelFor: function (field, opts) {
        let rule = this.rules(opts, field) || {};
        return rule.name || 'Label';
      },
      errorFor: function (field, opts) {
        let errors = binding.getErrors($this);
        let primaryErrorFlag = errors._flag & 1;
        return primaryErrorFlag ? errors[field || ''] || '' : undefined;
      },
      onBlurFor: function (field, opts) {
        return () => this.runFormats(opts, field);
      },
    };
  };
};
