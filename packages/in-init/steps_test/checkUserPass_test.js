/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('in-init/steps/InstanaOnboardingComponent_test', () => {
  describe('#checkIfUserCanPass', () => {
    it('should not pass if the ff is off and the timestamp is not present', () => {
      const checkIfUserCanPass = proxyquire('in-init/steps/checkUserPass', {
        'in-services/featureFlags': {
          skipOnboardingDialog: false
        }
      }).default;

      expect(checkIfUserCanPass(0)).to.equal(false);
    });

    it('should pass if the ff is on, even when the timestamp is not present', () => {
      const checkIfUserCanPass = proxyquire('in-init/steps/checkUserPass', {
        'in-services/featureFlags': {
          skipOnboardingDialog: true
        }
      }).default;

      expect(checkIfUserCanPass(0)).to.equal(true);
    });

    it('should pass if the ff is off, but the timestamp is not present', () => {
      const checkIfUserCanPass = proxyquire('in-init/steps/checkUserPass', {
        'in-services/featureFlags': {
          skipOnboardingDialog: false
        }
      }).default;

      expect(checkIfUserCanPass(42)).to.equal(true);
    });
  });
});
