import assert from 'power-assert';
import { default as V } from '../src/index';

describe('Example', () => {
    const rules = [
        V.rule('field', 'field label'),
        V.rule('value', 'value label', { value: false }),
        V.rule('email', 'email label', V.email, V.maxLength(100), V.required),
    ];
    it('should', () => {
        const v = V(this);
        v.rules = rules;
        v.runRules();
        assert(true);
    });
});
