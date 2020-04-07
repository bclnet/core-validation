/* istanbul ignore file */
export default function NullBinding(defaultStateProp) {
    window.state = window.state || {};
    window.setState = function (state) { };
    this.defaultStateProp = defaultStateProp || null;
}

NullBinding.prototype.getState = function ($this, opts) {
    const stateProp = (opts || {}).stateProp || this.defaultStateProp;
    const state = window.stateProp ? window.state[stateProp] : window.state;
    return state;
};

NullBinding.prototype.setState = function ($this, opts, values) {
    const stateProp = (opts || {}).stateProp || this.defaultStateProp;
    if (stateProp) { for (let key in values) state[key] = values[key]; $this.setState({ [stateProp]: state }); }
    else window.setState(values);
};

NullBinding.prototype.getErrors = function ($this, opts) {
    const errors = window.state.errors || { _flag: 0 };
    return errors;
};

NullBinding.prototype.setErrors = function ($this, errors) {
    window.setState({ errors });
};
