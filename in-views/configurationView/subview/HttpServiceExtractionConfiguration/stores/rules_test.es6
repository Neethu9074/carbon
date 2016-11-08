/* eslint-env mocha */

import proxyquire from 'proxyquire';
import {expect} from 'chai';

import {resetStoreRegistry} from 'in-stores/store';

describe('in-views/configurationView/subview/HttpServiceExtractionConfiguration/stores/rules', () => {
  let mod;

  beforeEach(() => {
    resetStoreRegistry();
    mod = proxyquire('./rules', {});
  });

  it('must have no rules initially', () => {
    expectRulesToDeepEqual([]);
  });

  it('must add new rules', () => {
    const rule = mod.addNewRule();
    expectRulesToDeepEqual([rule.toJS()]);
  });

  it('must create separate IDs for new rules', () => {
    const rule1 = mod.addNewRule();
    const rule2 = mod.addNewRule();
    expect(rule1.get('id')).not.to.equal(rule2.get('id'));
  });

  it('must add new rules to the end of the list', () => {
    const rule1 = mod.addNewRule();
    const rule2 = mod.addNewRule();
    expectRulesToDeepEqual([rule1.toJS(), rule2.toJS()]);
  });

  describe('with three existing rules', () => {
    let rule1;
    let rule2;
    let rule3;

    beforeEach(() => {
      rule1 = mod.addNewRule('r1');
      rule2 = mod.addNewRule('r2');
      rule3 = mod.addNewRule('r3');
    });

    it('must update existing rules', () => {
      rule1 = rule1.set('name', 'my name');
      mod.upsertRule(rule1);
      expectRulesToDeepEqual([rule1.toJS(), rule2.toJS(), rule3.toJS()]);
    });

    it('must update the last rule', () => {
      rule3 = rule3.set('name', 'my name');
      mod.upsertRule(rule3);
      expectRulesToDeepEqual([rule1.toJS(), rule2.toJS(), rule3.toJS()]);
    });

    it('must remove existing rules', () => {
      mod.removeRule(rule2.get('id'));
      expectRulesToDeepEqual([rule1.toJS(), rule3.toJS()]);
    });

    it('must support rearangement of rules', () => {
      mod.moveRuleUp(rule2.get('id'));
      expectRulesToDeepEqual([rule1.toJS(), rule3.toJS(), rule2.toJS()]);

      mod.moveRuleUp(rule2.get('id'));
      expectRulesToDeepEqual([rule1.toJS(), rule3.toJS(), rule2.toJS()]);

      mod.moveRuleUp(rule3.get('id'));
      expectRulesToDeepEqual([rule1.toJS(), rule2.toJS(), rule3.toJS()]);

      mod.moveRuleUp(rule1.get('id'));
      expectRulesToDeepEqual([rule2.toJS(), rule1.toJS(), rule3.toJS()]);

      mod.moveRuleDown(rule1.get('id'));
      expectRulesToDeepEqual([rule1.toJS(), rule2.toJS(), rule3.toJS()]);

      mod.moveRuleDown(rule1.get('id'));
      expectRulesToDeepEqual([rule1.toJS(), rule2.toJS(), rule3.toJS()]);
    });
  });

  function expectRulesToDeepEqual(expected) {
    let rules;
    mod.rules$.once(_rules => rules = _rules);
    expect(rules.toJS()).to.deep.equal(expected);
  }
});
