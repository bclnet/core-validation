// execution
import {
  find, flatten, valuedate, validate, format
} from './execution';

// accessors
export let create = function (binding, defaultRules) {
  return ($this) => {
    return {
      // STATE
      defaultRules: null,
      reset: function () {
        binding.setErrors($this, { _flag: 0 });
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

      // RUN
      getRules: function (opts, field) {
        let rules = (opts || {}).rules || this.defaultRules || defaultRules;
        let state = binding.getState($this, opts);
        if (field) return rules ? find(state, rules, field) : null;
        return rules ? flatten(state, rules) : [];
      },
      getFormats: function (opts, field) {
        let rules = (opts || {}).rules || this.defaultRules || defaultRules;
        let state = binding.getState($this, opts);
        let values = rules ? format(state, rules, field) : {};
        if (field && state[field] === values[field]) return;
        return values;
      },
      runRules: function (opts, field, flag) {
        let rules = (opts || {}).rules || this.defaultRules || defaultRules;
        let state = binding.getState($this, opts);
        let errors = rules ? validate(state, rules, field) : {};
        errors._flag = flag ? flag : binding.getErrors($this)._flag;
        binding.setErrors($this, errors);
        return errors;
      },
      runFormats: function (opts, field) {
        let rules = (opts || {}).rules || this.defaultRules || defaultRules;
        let state = binding.getState($this, opts);
        let values = rules ? format(state, rules, field) : {};
        if (field && state[field] === values[field]) return;
        binding.setState($this, opts, values);
        return values;
      },
      reduceState: function (opts, exceptFields) {
        let state = binding.getState($this, opts);
        let fieldMap = this.getRules(opts).reduce((y, x) => Object.assign(y, { [x.field]: exceptFields ? exceptFields.includes(x.field) : true }), {});
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
        let rule = this.getRules(opts, field) || {};
        return rule.name || 'Label';
      },
      valueFor: function (field, opts) {
        let state = binding.getState($this, opts);
        return state[field] || '';
      },
      requiredFor: function (field, opts) {
        let rule = this.getRules(opts, field) || {};
        let required = rule.args && rule.args.some(x => x.n === 'required');
        return required;
      },
      errorFor: function (field, opts) {
        let errors = binding.getErrors($this);
        let primaryErrorFlag = errors._flag & 1;
        return primaryErrorFlag ? errors[field || ''] || '' : undefined;
      },
      formatFor: function (field, opts) {
        return this.getFormats(opts, field)[field];
      },
      changeFor: function (field, opts) {
        return {
          id: field,
          target: null,
          type: 'rule',
          value: this.getFormats(opts, field)[field],
        }
      },
      onBlurFor: function (field, opts) {
        return () => { this.runFormats(opts, field); }
      },
    };
  };
};
