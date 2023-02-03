/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { getThresholdTypeForUpdatedEvaluationType as sut } from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/AlertEvaluationControl';
import {
  applicationThresholdTypeOptions,
  withoutHistoricBaselineOptions
} from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import {
  PER_AP,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { BluePrint } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';

const blueprintWithoutBaselineSupport = {
  baselineEnabled: false,
  getThresholdTypeOptions: () => withoutHistoricBaselineOptions(applicationThresholdTypeOptions)
} as BluePrint;

const blueprintWithBaselineSupport = {
  baselineEnabled: true,
  getThresholdTypeOptions: () => applicationThresholdTypeOptions
} as BluePrint;

describe('in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/AlertEvaluationControl', () => {
  describe('when a blueprint has no baseline support ', () => {
    // e.g. current logs - blueprint
    it('should switch to STATIC type for global and individual SA when switching to any Evaluation Type', () => {
      expect(sut(blueprintWithoutBaselineSupport, PER_AP, false, undefined)).toBe(STATIC_THRESHOLD);
      expect(sut(blueprintWithoutBaselineSupport, PER_AP_SERVICE, false, undefined)).toBe(STATIC_THRESHOLD);
      expect(sut(blueprintWithoutBaselineSupport, PER_AP_SERVICE, true, undefined)).toBe(STATIC_THRESHOLD);
    });
  });

  describe('when a blueprint with baseline support ', () => {
    describe('on a global SA', () => {
      it('should switch to STATIC type for any evaluation type', () => {
        expect(sut(blueprintWithBaselineSupport, PER_AP_SERVICE, true, HISTORIC_BASELINE)).toBe(STATIC_THRESHOLD);
        expect(sut(blueprintWithBaselineSupport, PER_AP, true, HISTORIC_BASELINE)).toBe(STATIC_THRESHOLD);
        expect(sut(blueprintWithBaselineSupport, PER_AP_SERVICE, true, undefined)).toBe(STATIC_THRESHOLD);
        expect(sut(blueprintWithBaselineSupport, PER_AP, true, undefined)).toBe(STATIC_THRESHOLD);
      });
    });
    describe('on a non-global SA', () => {
      it('should switch to STATIC type when switching to PerService or PerEndpoint', () => {
        expect(sut(blueprintWithBaselineSupport, PER_AP_SERVICE, false, HISTORIC_BASELINE)).toBe(STATIC_THRESHOLD);
        expect(sut(blueprintWithBaselineSupport, PER_AP_SERVICE, false, undefined)).toBe(STATIC_THRESHOLD);
      });
      it('should keep threshold type when switching to PerAp', () => {
        expect(sut(blueprintWithBaselineSupport, PER_AP, false, HISTORIC_BASELINE)).toBe(HISTORIC_BASELINE);
        expect(sut(blueprintWithBaselineSupport, PER_AP, false, undefined)).toBe(STATIC_THRESHOLD);
      });
    });
  });
});
