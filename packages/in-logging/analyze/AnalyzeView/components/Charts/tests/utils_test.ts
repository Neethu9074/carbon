/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  getLogsChartConfig,
  getMetricConfig,
  getNextLogLevelForChart
} from 'in-logging/analyze/AnalyzeView/components/Charts/utils';
import { EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { ChartedMetric } from 'in-components/AnalyzeView/StateManagement';
import { LogGroupItem, TagFilterExpression } from 'in-types';

describe('getNextLogLevelForChart', () => {
  it('should return null when no log groups are provided', () => {
    const result = getNextLogLevelForChart();
    expect(result).toBeNull();
  });

  it('should filter out default log levels', () => {
    const logGroups: LogGroupItem[] = [
      { label: 'ERROR', numberOfLogs: 10, cursor: { ingestionTime: 1, offset: 1 }, percentage: 10 },
      { label: 'WARN', numberOfLogs: 5, cursor: { ingestionTime: 2, offset: 2 }, percentage: 20 }
    ];

    const result = getNextLogLevelForChart(logGroups);
    expect(result).toBeNull();
  });

  it('should sort log groups correctly by number of logs', () => {
    const logGroups: LogGroupItem[] = [
      { label: 'TRACE', numberOfLogs: 3, cursor: { ingestionTime: 1, offset: 1 }, percentage: 10 },
      { label: 'DEBUG', numberOfLogs: 6, cursor: { ingestionTime: 2, offset: 2 }, percentage: 20 },
      { label: 'VERBOSE', numberOfLogs: 4, cursor: { ingestionTime: 3, offset: 3 }, percentage: 30 }
    ];

    const result = getNextLogLevelForChart(logGroups);
    expect(result).toEqual({
      label: 'DEBUG',
      numberOfLogs: 6,
      cursor: { ingestionTime: 2, offset: 2 },
      percentage: 20
    });
  });

  it('should return the first log group when multiple have the same highest number of logs', () => {
    const logGroups: LogGroupItem[] = [
      { label: 'DEBUG', numberOfLogs: 10, cursor: { ingestionTime: 1, offset: 1 }, percentage: 30 },
      { label: 'TRACE', numberOfLogs: 10, cursor: { ingestionTime: 2, offset: 2 }, percentage: 50 },
      { label: 'VERBOSE', numberOfLogs: 5, cursor: { ingestionTime: 3, offset: 3 }, percentage: 20 }
    ];

    const result = getNextLogLevelForChart(logGroups);
    expect(result).toEqual({
      label: 'DEBUG',
      numberOfLogs: 10,
      cursor: { ingestionTime: 1, offset: 1 },
      percentage: 30
    });
  });
});

describe('getLogsChartConfig', () => {
  const mockMetric = { metricId: 'metric1', aggregationId: 'SUM' } as ChartedMetric;
  const mockTagFilterExpression = { elements: [], logicalOperator: 'AND', type: EXPRESSION } as TagFilterExpression;

  it('should include next log level when available', () => {
    const logGroups = [
      { label: 'DEBUG', numberOfLogs: 10, cursor: { ingestionTime: 123, offset: 1 }, percentage: 50 },
      { label: 'ERROR', numberOfLogs: 5, cursor: { ingestionTime: 123, offset: 0 }, percentage: 50 }
    ];

    const config = getLogsChartConfig(mockTagFilterExpression, mockMetric, logGroups);

    expect(config.y1.metrics).toContainEqual(
      expect.objectContaining({
        label: expect.any(String),
        metricTagFilterExpression: expect.objectContaining({
          value: 'DEBUG'
        })
      })
    );
  });
});

describe('getMetricConfig', () => {
  const mockMetric = { metricId: 'metric1', aggregationId: 'SUM' } as ChartedMetric;
  const mockTagFilterExpression = { elements: [], logicalOperator: 'AND', type: EXPRESSION } as TagFilterExpression;

  it('should set NOT_EMPTY operator for KEY_VALUE_PAIR type without key', () => {
    const result = getMetricConfig({
      backendQueryModelWithFacets: mockTagFilterExpression,
      metric: mockMetric,
      tag: 'logLevel',
      value: 'ERROR',
      type: 'KEY_VALUE_PAIR'
    });

    expect(result.metricTagFilterExpression.operator).toBe('NOT_EMPTY');
    expect(result.metricTagFilterExpression.key).toBe('ERROR');
    expect(result.metricTagFilterExpression.value).toBeUndefined();
  });

  it('should set EQUALS operator with key and value for KEY_VALUE_PAIR type', () => {
    const result = getMetricConfig({
      backendQueryModelWithFacets: mockTagFilterExpression,
      metric: mockMetric,
      tag: 'logLevel',
      value: 'ERROR',
      key: 'level',
      type: 'KEY_VALUE_PAIR'
    });

    expect(result.metricTagFilterExpression.operator).toBe('EQUALS');
    expect(result.metricTagFilterExpression.key).toBe('level');
    expect(result.metricTagFilterExpression.value).toBe('ERROR');
  });
});
