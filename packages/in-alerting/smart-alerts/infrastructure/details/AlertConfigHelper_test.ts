/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  getMetricFormat,
  getThresholdTypeOptions,
  infraThresholdTypeOptions,
  getMaxMetricValue,
  getFormatter,
  getMetricUnitPostfix
} from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { number, percentage } from 'in-services/formatters/number';

describe('in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper', () => {
  describe('getMetricFormat', () => {
    it('returns the percentage formatter when the formatter is PERCENTAGE', () => {
      const metricFormat = getMetricFormat('PERCENTAGE', 1);

      expect(metricFormat).toBe(percentage);
    });

    it('returns the compact number formatter when the formatter is not PERCENTAGE', () => {
      const metricFormat = getMetricFormat('NUMBER', 9);

      expect(metricFormat).toBe(number.forcedCompact);
    });
  });

  describe('getThresholdTypeOptions', () => {
    it('returns the threshold type options', () => {
      const thresholdTypeOptions = getThresholdTypeOptions();

      expect(thresholdTypeOptions).toEqual(infraThresholdTypeOptions);
    });
  });

  describe('getFormatter', () => {
    it('returns the correct formatter name for a given entity type and metric name', () => {
      const entityType = 'host';
      const metricName = 'cpu.used';

      const formatterName = getFormatter(entityType, metricName);

      expect(formatterName).toEqual('PERCENTAGE');
    });

    it('returns an empty string if no entity type or metric name is provided', () => {
      const entityType = undefined;
      const metricName = undefined;

      const formatterName = getFormatter(entityType, metricName);

      expect(formatterName).toEqual('');
    });
  });

  describe('getMaxMetricValue', () => {
    it('returns 100 for percentage metrics', () => {
      const isPercentageMetric = true;

      const maxMetricValue = getMaxMetricValue(isPercentageMetric);

      expect(maxMetricValue).toEqual(100);
    });

    it('returns Number.MAX_SAFE_INTEGER for non-percentage metrics', () => {
      const isPercentageMetric = false;

      const maxMetricValue = getMaxMetricValue(isPercentageMetric);

      expect(maxMetricValue).toEqual(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('getMetricUnitPostfix', () => {
    it('returns "ms" when the formatter is MILLIS', () => {
      const unitPostfix = getMetricUnitPostfix('MILLIS');

      expect(unitPostfix).toBe('ms');
    });

    it('returns "%" when the formatter is PERCENTAGE', () => {
      const unitPostfix = getMetricUnitPostfix('PERCENTAGE');

      expect(unitPostfix).toBe('%');
    });

    it('returns "ns" when the formatter is NANOS', () => {
      const unitPostfix = getMetricUnitPostfix('NANOS');

      expect(unitPostfix).toBe('ns');
    });

    it('returns an empty string when the formatter is not recognized', () => {
      const unitPostfix = getMetricUnitPostfix('UNKNOWN');

      expect(unitPostfix).toBe('');
    });
  });
});
