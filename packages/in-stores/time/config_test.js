/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */
import { getTimeConfig, urlQueryKeys } from 'in-stores/time/config';
import { config } from 'in-services/config';
import { hours } from 'in-services/time';

describe('time config', () => {
  let originalFeatureFlags;

  beforeEach(() => {
    originalFeatureFlags = config.featureFlags;
    config.featureFlags = {};
  });

  afterEach(() => {
    config.featureFlags = originalFeatureFlags;
  });

  describe('getTimeConfig', () => {
    it('should read to from query params', () => {
      expect(
        getTimeConfig({
          query: {
            [urlQueryKeys.to]: '123456789'
          }
        }).to
      ).toEqual(123456789);
    });

    it('should set to to undefined if not present in query params', () => {
      expect(
        getTimeConfig({
          query: {}
        }).to
      ).toEqual(null);
    });

    it('should read window size from query params', () => {
      expect(
        getTimeConfig({
          query: {
            [urlQueryKeys.windowSize]: '123456789'
          }
        }).windowSize
      ).toEqual(123456789);
    });

    it('should not exceed max window size', () => {
      expect(
        getTimeConfig({
          query: {
            [urlQueryKeys.windowSize]: '2678400001'
          }
        }).windowSize
      ).toEqual(2678400000);
    });

    it('should at least use minimum window size', () => {
      expect(
        getTimeConfig({
          query: {
            [urlQueryKeys.windowSize]: '59999'
          }
        }).windowSize
      ).toEqual(60000);
    });

    describe('in 2.0', () => {
      it('should fall back to default window size', () => {
        expect(
          getTimeConfig({
            query: {}
          }).windowSize
        ).toEqual(hours.toMillis(1));
      });

      it('should auto refresh in 2.0 if to is null and ar query param is set', () => {
        expect(
          getTimeConfig({
            query: {
              [urlQueryKeys.autoRefresh]: 'true'
            }
          }).autoRefresh
        ).toEqual(true);
      });

      it('should not auto refresh in 2.0 without explicit ar query param', () => {
        // this test can be enabled permanently after 2.0 GA
        expect(
          getTimeConfig({
            query: {}
          }).autoRefresh
        ).toEqual(false);
      });
    });
  });
});
