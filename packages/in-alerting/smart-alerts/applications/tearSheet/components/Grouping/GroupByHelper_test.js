/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  getDetailedMetricTooltipValueFormatter,
  isNumberFormatter,
  getDetailedMetricTooltipValue,
  defaultColorFunction
} from 'in-alerting/smart-alerts/applications/tearSheet/components/Grouping/GroupByHelper';
import { GROUP_COLORS } from 'in-components/AnalyzeView/utils.ts';

describe('in-alerting/smart-alerts/applications/tearSheet/components/Grouping/GroupByHelper', () => {
  describe('getDetailedMetricTooltipValueFormatter', () => {
    it('returns the compact number formatter when a customFormatterId and formatter is not provided', () => {
      const formatter = getDetailedMetricTooltipValueFormatter(null, undefined);
      expect(formatter(1000)).toBe('1,000.00');
    });

    it('returns the detailed number formatter when a customFormatterId is null and formatter = MILLIS', () => {
      const formatter = getDetailedMetricTooltipValueFormatter(null, 'MILLIS');
      expect(formatter(0.123456789)).toBe('0.12ms');
    });

    it('returns the custom formatter when a custom formatter ID is provided', () => {
      const formatter = getDetailedMetricTooltipValueFormatter('myCustomFormatter', 'NUMBER');
      expect(formatter(1000)).toBe('1,000.00');
    });
  });

  describe('isNumberFormatter', () => {
    test('returns true when the formatter is "NUMBER"', () => {
      expect(isNumberFormatter('NUMBER')).toBe(true);
    });
  });

  describe('getDetailedMetricTooltipValue', () => {
    const metricFormatter = value => `$${value.toFixed(2)}`;

    it('returns null if metric is not an array', () => {
      expect(getDetailedMetricTooltipValue({}, metricFormatter)).toBeNull();
    });

    it('returns null if metric is an array but its length is not equal to 1', () => {
      expect(getDetailedMetricTooltipValue([[], []], metricFormatter)).toBeNull();
    });

    it('returns null if metric is an array with a single element but its length is not equal to 2', () => {
      expect(getDetailedMetricTooltipValue([[1]], metricFormatter)).toBeNull();
    });

    it('returns the formatted value of the second element of the first element of metric if both conditions are met', () => {
      expect(getDetailedMetricTooltipValue([[1, 2.5]], metricFormatter)).toEqual('$2.50');
    });
  });

  describe('defaultColorFunction', () => {
    it('returns the correct color based on the index', () => {
      expect(defaultColorFunction({}, 0)).toBe(GROUP_COLORS[0]);
      expect(defaultColorFunction({}, 1)).toBe(GROUP_COLORS[1]);
      expect(defaultColorFunction({}, 2)).toBe(GROUP_COLORS[2]);
    });
  });
});
