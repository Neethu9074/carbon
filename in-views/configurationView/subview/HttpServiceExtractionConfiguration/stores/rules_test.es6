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

  function expectRulesToDeepEqual(done, expected) {
    mod.rules$.once(rules => {
      expect(rules.toJS()).to.deep.equal(expected);
      done();
    });
  }
});
