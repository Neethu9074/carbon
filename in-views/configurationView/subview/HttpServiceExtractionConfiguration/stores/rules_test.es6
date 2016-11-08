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

  it('must have no rules initially', done => {
    expectRulesToDeepEqual(done, []);
  });

  it('must add new rules', done => {
    const rule = mod.addNewRule();
    expectRulesToDeepEqual(done, [rule.toJS()]);
  });

  it('must create separate IDs for new rules', () => {
    const rule1 = mod.addNewRule();
    const rule2 = mod.addNewRule();
    expect(rule1.get('id')).not.to.equal(rule2.get('id'));
  });

  function expectRulesToDeepEqual(done, expected) {
    mod.rules$.once(rules => {
      expect(rules.toJS()).to.deep.equal(expected);
      done();
    });
  }
});
