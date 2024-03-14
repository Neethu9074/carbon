/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { LogGroupItem, TagFilterExpressionElementUnion } from '@instana/types';

import { getUnifiedMetricConfig, setDefaultMetrics } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import data from 'in-alerting/smart-alerts/logs/data/alertConfigData.json';
import { numberCompact } from 'in-stores/metric/formatters';
import { line } from 'in-stores/metric/renderer';

const items: LogGroupItem[] = data.logGroupItem;

describe('in-alerting/smart-alerts/logs/components/LogChartUtils', () => {
  describe('getUnifiedMetricConfig', () => {
    it('returns a valid unified metric config object', () => {
      const metricId = 'logs_distribution';
      const tagFilterExpression = data.tagFilterExpression as TagFilterExpressionElementUnion;
      const granularity = 600000;

      const unifiedMetricConfig = getUnifiedMetricConfig(metricId, tagFilterExpression, granularity);

      expect(unifiedMetricConfig).toEqual({
        type: 'TIME_SERIES',
        granularity,
        y1: {
          formatter: numberCompact.id,
          min: 0,
          renderer: line.id,
          metrics: [
            {
              aggregation: 'SUM',
              metric: metricId,
              source: 'LOG',
              tagFilterExpression,
              timeShift: 0
            }
          ]
        }
      });
    });
  });

  describe('setDefaultMetrics', () => {
    it('sets the default metric group when no metric group is selected', () => {
      const setSelectedMetricGroup = jest.fn();
      const selectedMetricGroup = undefined;

      setDefaultMetrics(items, setSelectedMetricGroup, selectedMetricGroup);

      expect(setSelectedMetricGroup).toHaveBeenCalledWith(items[0].label);
    });

    it('sets the default metric group when the selected metric group is not found in the list of log groups', () => {
      const setSelectedMetricGroup = jest.fn();
      const selectedMetricGroup = '123';

      setDefaultMetrics(items, setSelectedMetricGroup, selectedMetricGroup);

      expect(setSelectedMetricGroup).toHaveBeenCalledWith(items[0].label);
    });

    it('does not set the default metric group when the selected metric group is found in the list of log groups', () => {
      const setSelectedMetricGroup = jest.fn();
      const selectedMetricGroup = items[1].label;

      setDefaultMetrics(items, setSelectedMetricGroup, selectedMetricGroup);

      expect(setSelectedMetricGroup).not.toHaveBeenCalled();
    });
  });
});
