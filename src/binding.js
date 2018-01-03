// execution
import {
  find, flatten, valuedate, validate, format
} from './execution';

// accessors
export let create = function (binding, defaultRules) {
  return ($this) => {
    return {
      reset: function () {
        binding.setErrors($this, { _flag: 0 });
      },
      rules: function (opt, field) {
        let rules = (opt || {}).rules || defaultRules;
        let state = binding.getState($this, opt);
        if (field) return rules ? find(state, rules, field) : null;
        return rules ? flatten(state, rules) : [];
      },
      runRules: function (opt, field, flag) {
        let rules = (opt || {}).rules || defaultRules;
        let state = binding.getState($this, opt);
        let errors = rules ? validate(state, rules, field) : {};
        errors._flag = flag ? flag : binding.getErrors($this)._flag;
        binding.setErrors($this, errors);
        return errors;
      },
      runValues: function (opt, field) {
        let rules = (opt || {}).rules || defaultRules;
        let state = binding.getState($this, opt);
        let values = rules ? valuedate(state, rules, field) : {};
        binding.setState($this, opt, values);
        return values;
      },
      runFormats: function (opt, field) {
        let rules = (opt || {}).rules || defaultRules;
        let state = binding.getState($this, opt);
        let values = rules ? format(state, rules, field) : {};
        if (field && state[field] == values[field]) return;
        binding.setState($this, opt, values);
        return values;
      },
      reduceState: function (opt, clearExceptFields) {
        let state = binding.getState($this, opt);
        let fieldMap = this.rules(opt).reduce((y, x) => Object.assign(y, { [x.field]: clearExceptFields ? clearExceptFields.includes(x.field) : true }), {});
        Object.keys(state).forEach(function (key) {
          if (!fieldMap[key]) {
            state[key] = '';
            //delete state[key];
          }
        });
        binding.setState($this, opt, state);
        return state;
      },

      hasErrors: function (opt) {
        let skipRules = (opt || {}).skipRules || false;
        let errors = !skipRules ? this.runRules(opt, null, 1) : binding.getErrors($this);
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

      labelFor: function (field, opt) {
        let rule = this.rules(opt, field) || {};
        return rule.name || 'Label';
      },
      errorFor: function (field, opt) {
        let errors = binding.getErrors($this);
        let primaryErrorFlag = errors._flag & 1;
        return primaryErrorFlag ? errors[field || ''] || '' : undefined;
      },
      onBlurFor: function (field, opt) {
        return () => this.runFormats(opt, field);
      },
    };
  };
};
