# core-validation
core validation for form state

## Install

```
$ npm install core-validation --save
```

## Example

```javascript
import React from 'react';
import { default as V } from 'core-validation';

const Rules = [
    V.rule('message', 'Message Body', V.required),
];

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleInputChange = (e) => {
        // set state
        V(this).runRules({ rules: Rules });
    })
    handleSubmit = (e) => {
        e.preventDefault();
        if (V(this).hasErrors({ rules: Rules })) return;
        // do submit
    }
    render() {
        const v = V(this);
        v.rules = Rules;
        return (
            <div>
                <input error={v.errorFor('message')} label={v.labelFor('message')} value={v.valueFor('message')} onChange={this.handleInputChange} />
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

