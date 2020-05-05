import assert from 'power-assert';
import { default as V } from '../src/index';

describe('Rule', () => {
    it('should parse simple rules', () => {
        const rules = [
            V.rule('field', 'field label'),
            V.rule('value', 'value label', { value: false }),
            V.rule('required', 'required label', V.required),
            V.rule('email', 'email label', V.email),
        ];
        expect(rules.length).toBe(4);
        expect(rules[0].r.field).toBe('field'); expect(rules[0].r.label).toBe('field label'); expect(rules[0].r.args.length).toBe(0); expect(rules[0].r.state).toStrictEqual({});
        expect(rules[1].r.field).toBe('value'); expect(rules[1].r.args.length).toBe(0); expect(rules[1].r.state).toStrictEqual({ value: false });
        expect(rules[2].r.field).toBe('required'); expect(rules[2].r.args.length).toBe(1); expect(rules[2].r.state).toStrictEqual({});
        expect(rules[3].r.field).toBe('email'); expect(rules[3].r.args.length).toBe(1); expect(rules[3].r.state).toStrictEqual({});
    });
    it('should parse complex rules', () => {
        const rules = [
            V.rule('email', 'email label', V.email({ maxValue: 10 }), V.maxLength(100), V.required),
        ];
        expect(rules.length).toBe(1);
        expect(rules[0].r.field).toBe('email'); expect(rules[0].r.label).toBe('email label'); expect(rules[0].r.args.length).toBe(3); expect(rules[0].r.state).toStrictEqual({});
    });
    it('should parse custom rule', () => {
        const rules = [
            V.rule('field', 'field label', V.custom((a, b, c) => false, 'Error')),
        ];
        expect(rules.length).toBe(1);
        expect(rules[0].r.args.length).toBe(1);
    });
});

describe('RuleIf', () => {
    it('should parse conditional rule', () => {
        const rules = [
            V.rule('field', 'field label'),
            V.ruleIf('field',
                V.rule('subField1', 'subField1 label'),
                V.rule('subField2', 'subField2 label')
            ),
        ];
        expect(rules.length).toBe(2);
    });
});

describe('Find', () => {
    it('should find simple rule', () => {
        const rules = [
            V.rule('field', 'field label'),
        ];
        expect(V.find(null, rules, 'nofield')).toBe(null);
        expect(V.find(null, rules, 'field').field).toBe('field');
    });
    it('should find nested rule', () => {
        const rules = [
            V.rule('field', 'field label'),
            V.ruleIf('field',
                V.rule('subField1', 'subField1 label'),
                V.rule('subField2', 'subField2 label')
            ),
        ];
        let state = { field: false };
        expect(V.find(state, rules, 'subField1')).toBe(null);
        state = { field: true };
        expect(V.find(state, rules, 'subField1').field).toBe('subField1');
    });
});

describe('Flatten', () => {
    it('should flatten simple rule', () => {
        const rules = [
            V.rule('field', 'field label'),
        ];
        expect(V.flatten(null, rules).length).toBe(1);
    });
    it('should flatten nested rule', () => {
        const rules = [
            V.rule('field', 'field label'),
            V.ruleIf('field',
                V.rule('subField1', 'subField1 label'),
                V.rule('subField2', 'subField2 label')
            ),
        ];
        let state = { field: false };
        expect(V.flatten(state, rules).length).toBe(1);
        state = { field: true };
        expect(V.flatten(state, rules).length).toBe(3);
    });
});
