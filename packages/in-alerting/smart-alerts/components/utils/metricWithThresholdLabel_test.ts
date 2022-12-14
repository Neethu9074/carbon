/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { createMetricWithThresholdLabel } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { millis, percentage, number } from 'in-services/formatters/number';

describe('in-alerting/smart-alerts/components/utils/metricWithThresholdLabel', () => {
  describe('createMetricWithThresholdLabel', () => {
    it('create label with static threshold and time metric', () => {
      const label = createMetricWithThresholdLabel(
        'Latency (75th)',
        STATIC_THRESHOLD,
        200,
        millis.forcedFixedCompact,
        '>'
      );

      expect(label).toBe('Latency (75th) > 200ms');
    });

    it('create label with static threshold and rate metric', () => {
      const label = createMetricWithThresholdLabel('Error Rate', STATIC_THRESHOLD, 0.03, percentage, '<=');

      expect(label).toBe('Error Rate ≤ 3%');
    });

    it('create text for http status code count type with static threshold', () => {
      const label = createMetricWithThresholdLabel(
        'Status Code Count',
        STATIC_THRESHOLD,
        123,
        number.forcedCompact,
        '>='
      );

      expect(label).toBe('Status Code Count ≥ 123');
    });

    it('create label with adaptive threshold and rate metric', () => {
      const label = createMetricWithThresholdLabel('Error Rate', ADAPTIVE_BASELINE, 0.03, percentage, '<=');

      expect(label).toBe('Error Rate');
    });

    it('create label with historic baseline threshold and rate metric', () => {
      const label = createMetricWithThresholdLabel('Error Rate', HISTORIC_BASELINE, 0.03, percentage, '<=');

      expect(label).toBe('Error Rate');
    });
  });
});
