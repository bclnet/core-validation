# core-validation
core validation for form state

## Install

```
$ npm install core-validation --save
```


## Example

```javascript
import React from 'react';
import * as V from 'core-validation';

let Validator = V.create(new V.ReactBinding(), [
    V.rule('message', 'Message Body', V.required),
]);

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleInputChange = (e) => {
        // set state
        Validator(this).runRules();
    })
    handleSubmit = (e) => {
        e.preventDefault();
        if (Validator(this).hasErrors()) return;
        // do submit
    }
    render() {
        const v = Validator(this);
        return (
            <div>
                <input id="message" error={v.errorFor('message')} label={v.labelFor('message')} onBlur={v.onBlurFor('message')} value={this.state.message} onChange={this.handleInputChange} />
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}
```




### reset
descrition of reset

`export let reset = function ($this);`

### hasErrors
description of hasErrors

`export let hasErrors = function ($this, rules, stateProp);`

