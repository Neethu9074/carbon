/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { applicationThresholdTypeOptions, getAvailableOptionsForEvaluationType } from './applicationThresholdFormData';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { PER_AP_SERVICE } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { DAILY, WEEKLY } from 'in-alerting/smart-alerts/data/seasonalities';

jest.mock('in-services/featureFlags', () => ({
  get adaptiveBaselineEnabled() {
    return true;
  }
}));

/* eslint-env jest */

describe('in-alerting/smart-alerts/applications/data/applicationThresholdFormData::getAvailableOptionsForEvaluationType', () => {
  test('Return all options for individual smart alert', () => {
    const thresholdOpts = getAvailableOptionsForEvaluationType(applicationThresholdTypeOptions, null, false);
    expect(thresholdOpts).toHaveLength(4);
    expect(thresholdOpts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: STATIC_THRESHOLD }),
        expect.objectContaining({ value: `${HISTORIC_BASELINE}.${DAILY}` }),
        expect.objectContaining({ value: `${HISTORIC_BASELINE}.${WEEKLY}` }),
        expect.objectContaining({ value: ADAPTIVE_BASELINE })
      ])
    );
  });

  test('Return only Adaptive–Baseline and Static–Threshold options for global smart alert', () => {
    const thresholdOpts = getAvailableOptionsForEvaluationType(applicationThresholdTypeOptions, null, true);
    expect(thresholdOpts).toHaveLength(2);
    expect(thresholdOpts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: STATIC_THRESHOLD }),
        expect.objectContaining({ value: ADAPTIVE_BASELINE })
      ])
    );
  });

  test('Return only Adaptive–Baseline and Static–Threshold options for individual smart alert where evaluation type is Per–Service', () => {
    const thresholdOpts = getAvailableOptionsForEvaluationType(applicationThresholdTypeOptions, PER_AP_SERVICE, false);
    expect(thresholdOpts).toHaveLength(2);
    expect(thresholdOpts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: STATIC_THRESHOLD }),
        expect.objectContaining({ value: ADAPTIVE_BASELINE })
      ])
    );
  });
});

describe('in-alerting/smart-alerts/applications/data/applicationThresholdFormData::withoutHistoricBaselineOptions', () => {
  test('Return only Adaptive–Baseline and Static–Threshold options ', () => {
    const thresholdOpts = getAvailableOptionsForEvaluationType(applicationThresholdTypeOptions, PER_AP_SERVICE, false);
    expect(thresholdOpts).toHaveLength(2);
    expect(thresholdOpts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: STATIC_THRESHOLD }),
        expect.objectContaining({ value: ADAPTIVE_BASELINE })
      ])
    );
  });
});
