/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */
import { expect } from 'chai';

describe('in-init/steps/InstanaOnboardingComponent_test', () => {
  describe('#checkIfUserCanPass', () => {
    it('should not pass if the ff is off and the timestamp is not present', () => {
      return importWithFeatureFlags({
        skipOnboardingDialog: false
      }).then(checkIfUserCanPass => expect(checkIfUserCanPass(0)).to.equal(false));
    });

    it('should pass if the ff is on, even when the timestamp is not present', () => {
      return importWithFeatureFlags({
        skipOnboardingDialog: true
      }).then(checkIfUserCanPass => expect(checkIfUserCanPass(0)).to.equal(true));
    });

    it('should pass if the ff is off, but the timestamp is not present', () => {
      return importWithFeatureFlags({
        skipOnboardingDialog: false
      }).then(checkIfUserCanPass => expect(checkIfUserCanPass(42)).to.equal(true));
    });
  });

  function importWithFeatureFlags(injectedFlags) {
    jest.doMock('in-services/featureFlags', () => ({
      ...injectedFlags
    }));

    // when overriding static exports, we need to use dynamic imports
    return import('in-init/steps/checkUserPass').then(dynModule => dynModule.default);
  }

  beforeEach(() => {
    jest.resetModules();
  });
});
