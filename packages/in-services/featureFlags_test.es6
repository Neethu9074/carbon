/* eslint-env mocha */
/* global require: false, __dirname: false */
import { expect } from 'chai';

import { config } from 'in-services/config';

describe('feature flags', () => {
  let originalInstanaGlobal;
  let originalHash;
  let originalSettings;
  let originalFeatureFlags;

  beforeEach(() => {
    originalHash = window.location.hash;

    // when running on Jenkins, window.instana seems to not exist, so let's initialize it.
    originalInstanaGlobal = window.instana;
    window.instana = window.instana || {};

    originalSettings = window.instana.settings;
    window.instana.settings = {};

    originalFeatureFlags = config.featureFlags;
    config.featureFlags = {};
  });

  afterEach(() => {
    // we messed a lot with global variables in beforeEach, so let's clean up
    window.location.hash = originalHash;
    window.instana.settings = originalSettings;
    window.instana = originalInstanaGlobal;
    config.featureFlags = originalFeatureFlags;
  });

  describe('twoZeroModeEnabled', () => {
    it('is false if 2.0 is disabled', () => {
      setFeatureFlag('twoZeroAppDataEnabled', false);
      expectFeatureFlag('twoZeroModeEnabled', false);
    });

    it('is true if only 2.0 is enabled', () => {
      setFeatureFlag('oneZeroAppDataEnabled', false);
      setFeatureFlag('withoutInstana1Features', true); // compatibility test fix
      setFeatureFlag('twoZeroAppDataEnabled', true);
      expectFeatureFlag('twoZeroModeEnabled', true);
    });

    it('[compatibilty] is true if newApplicationMonitoringEnabled and withoutInstana1Features are enabled', () => {
      setFeatureFlag('newApplicationMonitoringEnabled', true);
      setFeatureFlag('withoutInstana1Features', true);
      expectFeatureFlag('twoZeroModeEnabled', true);
    });

    it('is true if 1.0 and 2.0 are enabled and query param v2 is true', () => {
      setFeatureFlag('oneZeroAppDataEnabled', true);
      setFeatureFlag('twoZeroAppDataEnabled', true);
      window.location.hash = 'whatever?foo=bar&v2=true&this=that';
      expectFeatureFlag('twoZeroModeEnabled', true);
    });

    it(
      '[compatibilty] is true if newApplicationMonitoringEnabled is enabled and withoutInstana1Features ' +
        'is disabled and query param v2 is true',
      () => {
        setFeatureFlag('newApplicationMonitoringEnabled', true);
        setFeatureFlag('withoutInstana1Features', false);
        window.location.hash = 'whatever?foo=bar&v2=true&this=that';
        expectFeatureFlag('twoZeroModeEnabled', true);
      }
    );

    it('is false if 1.0 and 2.0 are enabled and query param v2 is false', () => {
      setFeatureFlag('oneZeroAppDataEnabled', true);
      setFeatureFlag('twoZeroAppDataEnabled', true);
      window.location.hash = 'whatever?foo=bar&v2=false&this=that';
      expectFeatureFlag('twoZeroModeEnabled', false);
    });

    it(
      '[compatibilty] is false if newApplicationMonitoringEnabled is enabled and withoutInstana1Features ' +
        'is disabled and query param v2 is false',
      () => {
        setFeatureFlag('newApplicationMonitoringEnabled', true);
        setFeatureFlag('withoutInstana1Features', false);
        window.location.hash = 'whatever?foo=bar&v2=false&this=that';
        expectFeatureFlag('twoZeroModeEnabled', false);
      }
    );

    it('is false if 1.0 and 2.0 are enabled and query param v2 is not present and user setting is unspecified', () => {
      setFeatureFlag('oneZeroAppDataEnabled', true);
      setFeatureFlag('twoZeroAppDataEnabled', true);
      expectFeatureFlag('twoZeroModeEnabled', false);
    });

    it(
      '[compatibilty] is false if newApplicationMonitoringEnabled is enabled and withoutInstana1Features ' +
        'is disabled and query param v2 is not present and user setting is unspecified',
      () => {
        setFeatureFlag('newApplicationMonitoringEnabled', true);
        setFeatureFlag('withoutInstana1Features', false);
        expectFeatureFlag('twoZeroModeEnabled', false);
      }
    );

    it('is false if 1.0 and 2.0 are enabled and query param v2 is not present and user setting is false', () => {
      setFeatureFlag('oneZeroAppDataEnabled', true);
      setFeatureFlag('twoZeroAppDataEnabled', true);
      window.instana.settings.v2Enabled = false;
      expectFeatureFlag('twoZeroModeEnabled', false);
    });

    it(
      '[compatibilty] is false if newApplicationMonitoringEnabled is enabled and withoutInstana1Features ' +
        'is disabled and query param v2 is not present and user setting is false',
      () => {
        setFeatureFlag('newApplicationMonitoringEnabled', true);
        setFeatureFlag('withoutInstana1Features', false);
        window.instana.settings.v2Enabled = false;
        expectFeatureFlag('twoZeroModeEnabled', false);
      }
    );

    it('is true if 1.0 and 2.0 are enabled and query param v2 is not present and user setting is true', () => {
      setFeatureFlag('oneZeroAppDataEnabled', true);
      setFeatureFlag('twoZeroAppDataEnabled', true);
      window.instana.settings.v2Enabled = true;
      expectFeatureFlag('twoZeroModeEnabled', true);
    });

    it(
      '[compatibilty] is true if newApplicationMonitoringEnabled is enabled and withoutInstana1Features ' +
        'is disabled and query param v2 is not present and user setting is true',
      () => {
        setFeatureFlag('newApplicationMonitoringEnabled', true);
        setFeatureFlag('withoutInstana1Features', false);
        window.instana.settings.v2Enabled = true;
        expectFeatureFlag('twoZeroModeEnabled', true);
      }
    );
  });

  describe('isTwoZeroBetaPhase', () => {
    it('is true if 1.0 and 2.0 are enabled', () => {
      setFeatureFlag('oneZeroAppDataEnabled', true);
      setFeatureFlag('twoZeroAppDataEnabled', true);
      expectFeatureFlag('isTwoZeroBetaPhase', true);
    });

    it('is false if only 1.0 is enabled', () => {
      setFeatureFlag('oneZeroAppDataEnabled', true);
      setFeatureFlag('twoZeroAppDataEnabled', false);
      expectFeatureFlag('isTwoZeroBetaPhase', false);
    });

    it('is false if only 2.0 is enabled', () => {
      setFeatureFlag('oneZeroAppDataEnabled', false);
      setFeatureFlag('twoZeroAppDataEnabled', true);
      expectFeatureFlag('isTwoZeroBetaPhase', false);
    });
  });

  function setFeatureFlag(key, value) {
    config.featureFlags[key] = value;
  }

  function expectFeatureFlag(key, value) {
    // evaluating feature flags is a one-time event in production code, so we have to jump through some hoops here :-/
    const resolvedFileName = require.resolve(__dirname + '/featureFlags.es6');
    delete require.cache[resolvedFileName];
    let ff = require(resolvedFileName);
    expect(ff[key]).to.equal(value, `expected feature flag ${key} to be ${value}, but was ${ff[key]}.`);
  }
});
