/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createMetricLabel } from 'in-alerting/smart-alerts/applications/details/AlertThresholdInfos';
import { STATIC_THRESHOLD, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

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
  });
});
