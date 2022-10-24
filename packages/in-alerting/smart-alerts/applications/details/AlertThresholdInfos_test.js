/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { createMetricLabel } from 'in-alerting/smart-alerts/applications/details/AlertThresholdInfos';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

describe('in-alerting/smart-alerts/applications/details/AlertThresholdInfos', () => {
  describe('createFormattedMetricLabel', () => {
    it('create text for slowness type with static threshold', () => {
      const label = createMetricLabel('slowness', 'P75', STATIC_THRESHOLD, '200', '>');

      expect(label).toBe('Latency (75th) > 200ms');
    });

    it('create text for erroneous type with static threshold', () => {
      const label = createMetricLabel('errorRate', undefined, STATIC_THRESHOLD, '0.03', '>');

      expect(label).toBe('Error Rate > 3%');
    });

    it('create text for erroneous type with adaptive threshold', () => {
      const label = createMetricLabel('errorRate', undefined, ADAPTIVE_BASELINE);

      expect(label).toBe('Error Rate');
    });

    it('create text for http status code rate type with static threshold', () => {
      const label = createMetricLabel('statusCode', 'MEAN', STATIC_THRESHOLD, 0.5, '>', 'callRate');

      expect(label).toBe('Status Code Rate > 50%');
    });

    it('create text for http status code count type with static threshold', () => {
      const label = createMetricLabel('statusCode', 'MEAN', STATIC_THRESHOLD, 100, '>', 'calls');

      expect(label).toBe('Status Code Count > 100');
    });
  });
});
