export default function ReactBinding(defaultStateProp) {
    this.defaultStateProp = defaultStateProp || null;
}

ReactBinding.prototype.getState = function ($this, opt) {
    let stateProp = (opt || {}).stateProp || this.defaultStateProp;
    let state = stateProp ? $this.state[stateProp] : $this.state;
    return state;
};

ReactBinding.prototype.setState = function ($this, opt, values) {
    let stateProp = (opt || {}).stateProp || this.defaultStateProp;
    if (stateProp) { let state = {}; for (let key in values) state[key] = values[key]; $this.setState({ [stateProp]: state }); }
    else $this.setState(values);
};

ReactBinding.prototype.getErrors = function ($this) {
    let errors = $this.state.errors || { _flag: 0 };
    return errors;
};

ReactBinding.prototype.setErrors = function ($this, errors) {
    $this.setState({ errors });
};
