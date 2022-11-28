/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  applicationThresholdTypeOptions,
  filterThresholdTypeOptionsForEvaluationType,
  getOptionsFilterForThresholdTyp
} from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import {
  PER_AP,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { DAILY, WEEKLY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

describe('in-alerting/smart-alerts/applications/data/applicationThresholdFormData::filterThresholdTypeOptionsForEvaluationType', () => {
  test('Return all options for individual smart alert', () => {
    const thresholdOpts = filterThresholdTypeOptionsForEvaluationType(applicationThresholdTypeOptions, PER_AP, false);
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
    const thresholdOpts = filterThresholdTypeOptionsForEvaluationType(applicationThresholdTypeOptions, PER_AP, true);
    expect(thresholdOpts).toHaveLength(2);
    expect(thresholdOpts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: STATIC_THRESHOLD }),
        expect.objectContaining({ value: ADAPTIVE_BASELINE })
      ])
    );
  });

  test('Return only Adaptive–Baseline and Static–Threshold options for individual smart alert where evaluation type is Per–Service', () => {
    const thresholdOpts = filterThresholdTypeOptionsForEvaluationType(
      applicationThresholdTypeOptions,
      PER_AP_SERVICE,
      false
    );
    expect(thresholdOpts).toHaveLength(2);
    expect(thresholdOpts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: STATIC_THRESHOLD }),
        expect.objectContaining({ value: ADAPTIVE_BASELINE })
      ])
    );
  });
});

describe('in-alerting/smart-alerts/applications/data/applicationThresholdFormData::getOptionsFilterForThresholdTyp', () => {
  // contains all, independent of the feature-flag
  const allApplicationThresholdTypeOptions = [
    ...thresholdTypeOptions,
    {
      value: ADAPTIVE_BASELINE,
      label: t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionAdaptiveBaseline')
    }
  ];

  test('Return only Adaptive–Baseline option for AdaptiveBaseline Threshold', () => {
    const thresholdOpts = allApplicationThresholdTypeOptions.filter(getOptionsFilterForThresholdTyp(ADAPTIVE_BASELINE));

    expect(thresholdOpts).toHaveLength(1);
    expect(thresholdOpts.map(option => option.value)).toEqual(['adaptiveBaseline']);
  });

  test('Return no Adaptive option for Static–Threshold', () => {
    const thresholdOpts = allApplicationThresholdTypeOptions.filter(getOptionsFilterForThresholdTyp(STATIC_THRESHOLD));

    expect(thresholdOpts).toHaveLength(3);
    expect(thresholdOpts.map(option => option.value)).toEqual(
      expect.arrayContaining(['staticThreshold', 'historicBaseline.DAILY', 'historicBaseline.WEEKLY'])
    );
  });
});
