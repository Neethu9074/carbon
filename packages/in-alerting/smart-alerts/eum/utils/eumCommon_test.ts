/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getDefaultRules } from 'in-alerting/smart-alerts/eum/utils/eumCommon';

describe('getDefaultRules', () => {
  const defaultRule = {
    alertType: 'slowness',
    aggregation: 'P90',
    metricName: 'latency'
  };
  const useBaseline = true;
  const result = getDefaultRules(useBaseline, defaultRule);

  it('should return an array with one rule', () => {
    expect(result).toHaveLength(1);
  });

  it('should set the rule property to the defaultRule parameter', () => {
    expect(result[0].rule).toBe(defaultRule);
  });

  it('should set the thresholdOperator property to ">="', () => {
    expect(result[0].thresholdOperator).toBe('>=');
  });

  it('should set the thresholds property to an object with two properties', () => {
    expect(result[0].thresholds).toHaveProperty('WARNING');
    expect(result[0].thresholds).toHaveProperty('CRITICAL');
  });

  it('should set the WARNING threshold property to an object with the specified properties', () => {
    expect(result[0].thresholds.WARNING).toHaveProperty('type');
    expect(result[0].thresholds.WARNING).toHaveProperty('seasonality');
    expect(result[0].thresholds.WARNING).toHaveProperty('isCheckboxSelected');
    expect(result[0].thresholds.WARNING).toHaveProperty('deviationFactor');
    expect(result[0].thresholds.WARNING).toHaveProperty('value');
  });

  it('should set the CRITICAL threshold property to an object with the specified properties', () => {
    expect(result[0].thresholds.CRITICAL).toHaveProperty('type');
    expect(result[0].thresholds.CRITICAL).toHaveProperty('seasonality');
    expect(result[0].thresholds.CRITICAL).toHaveProperty('isCheckboxSelected');
    expect(result[0].thresholds.CRITICAL).toHaveProperty('deviationFactor');
    expect(result[0].thresholds.CRITICAL).toHaveProperty('value');
  });
});
