/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getAdjustedTimeConfigToIncludeTimestamp, getTimeConfig, urlQueryKeys } from 'in-stores/time/config';
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

  describe('getAdjustedTimeConfigToIncludeTimestamp', () => {
    it('should return unmodified time config, if the timestamp is included in the time range', () => {
      const granularity = 30_000;
      const timeConfig = {
        windowSize: 30 * granularity,
        to: Date.now(),
        autoRefresh: false
      };
      expect(getAdjustedTimeConfigToIncludeTimestamp(timeConfig, timeConfig.to, () => granularity)).toBe(timeConfig);
    });

    it('should return unmodified time config, if "timeConfig.to" is not specified (e.g. "Last hour") and the timestamp lays after the given time range', () => {
      const granularity = 60_000;
      const timeConfig = {
        windowSize: 60 * granularity,
        to: null,
        autoRefresh: false
      };
      const timestamp = Date.now() + 60_000;
      expect(getAdjustedTimeConfigToIncludeTimestamp(timeConfig, timestamp, () => granularity)).toBe(timeConfig);
    });

    it('should adjust time config and add a "safety" bucket, if "timestamp > "to"', () => {
      const granularity = 30_000;
      const timeConfig = {
        windowSize: 30 * granularity,
        to: Date.UTC(2022, 1, 1, 12, 30, 55),
        autoRefresh: false
      };
      const timestamp = Date.UTC(2022, 1, 1, 12, 31, 5);
      const safetyBucket = 6 * granularity;
      expect(getAdjustedTimeConfigToIncludeTimestamp(timeConfig, timestamp, () => granularity)).toEqual({
        windowSize: timeConfig.windowSize + 10_000 + safetyBucket,
        to: Date.UTC(2022, 1, 1, 12, 34, 5),
        autoRefresh: false
      });
    });

    it('should adjust time config and add a "safety" bucket, if "timestamp" < "from"', () => {
      const granularity = 30_000;
      const timeConfig = {
        windowSize: 30 * 2 * granularity,
        to: Date.UTC(2022, 1, 1, 12, 30, 40),
        autoRefresh: false
      };
      const fromDiff = 5_000;
      const timestamp = timeConfig.to - timeConfig.windowSize - fromDiff; // 5 seconds before the time range
      const safetyBucket = 6 * granularity;
      expect(getAdjustedTimeConfigToIncludeTimestamp(timeConfig, timestamp, () => granularity)).toEqual({
        windowSize: timeConfig.windowSize + fromDiff + safetyBucket,
        to: timeConfig.to,
        autoRefresh: false
      });
    });
  });
});
