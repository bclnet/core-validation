// context
export default {
    getState: function (ctx, stateProp) {

    },
    setState: function (ctx, stateProp, set) {
    },

    // error-flag
    errors: function () {
        let errors = $this.state.errors || { _flag: 0 };
        let primaryErrorFlag = errors._flag & 1;
        return primaryErrorFlag ? errors : {};
    },
    hasErrors: function () {
        let errors = $this.state.errors || { _flag: 0 };
        let primaryErrorFlag = errors._flag & 1;
        return primaryErrorFlag && Object.keys(errors).length !== 1;
    },
    hasErrorFlag: function (bit) {
        let errors = $this.state.errors || { _flag: 0 };
        return errors._flag & (1 << bit);
    },
    setErrorFlag: function (bit) {
        let errors = $this.state.errors || { _flag: 0 };
        errors._flag |= (1 << bit);
        $this.setState({ errors });
    },
    clearErrorFlag: function (bit) {
        let errors = $this.state.errors || { _flag: 0 };
        errors._flag &= ~(1 << bit);
        $this.setState({ errors });
    },
};
