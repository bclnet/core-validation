import assert from 'power-assert';
import { default as V } from '../src/index';

describe('Execution', () => {
    let rules = [
        V.rule('field', 'field label'),
        V.rule('value', 'value label', { value: false }),
    ];
    it('should', () => {
        const v = V(this);
        v.rules = rules;
        v.runRules();
        assert(true);
    });
});
