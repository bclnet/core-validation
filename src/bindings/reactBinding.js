/* istanbul ignore file */
export default function ReactBinding(defaultStateProp) {
    this.defaultStateProp = defaultStateProp || null;
}

ReactBinding.prototype.getState = function ($this, opts) {
    const stateProp = (opts || {}).stateProp || this.defaultStateProp;
    const state = stateProp ? $this.state[stateProp] : $this.state;
    return state;
};

ReactBinding.prototype.setState = function ($this, opts, values) {
    const stateProp = (opts || {}).stateProp || this.defaultStateProp;
    if (stateProp) { let state = {}; for (let key in values) state[key] = values[key]; $this.setState({ [stateProp]: state }); }
    else $this.setState(values);
};

ReactBinding.prototype.getErrors = function ($this) {
    const errors = $this.state.errors || { _flag: 0 };
    return errors;
};

ReactBinding.prototype.setErrors = function ($this, errors) {
    $this.setState({ errors });
};
