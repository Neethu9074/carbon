/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  PER_AP_ENDPOINT,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { AlertEvaluationType, ThresholdType } from 'in-types';
import { deepFreeze } from 'in-services/util/object';
import { Option } from 'in-components/ComboBox';
import { t } from 'in-i18n';

type Options = readonly Option[];

const baselineTypes = [HISTORIC_BASELINE, ADAPTIVE_BASELINE];

export const applicationThresholdTypeOptions: Options = deepFreeze([
  ...thresholdTypeOptions,
  {
    value: ADAPTIVE_BASELINE,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionAdaptiveBaseline')
  }
]);

/**
 * @returns true only if thresholdType is one of types 'historicBaseline' | 'adaptiveBaseline'
 */
export function isOneOfBaselineTypes(thresholdType: ThresholdType): boolean {
  return baselineTypes.includes(thresholdType);
}

export function filterThresholdTypeOptionsForEvaluationType(
  thresholdTypeOptions: Options = [],
  evaluationType: AlertEvaluationType,
  isGlobalSmartAlert: boolean
): Options {
  return thresholdTypeOptions.filter(({ value }) => {
    if (isGlobalSmartAlert || [PER_AP_SERVICE, PER_AP_ENDPOINT].includes(evaluationType)) {
      return [ADAPTIVE_BASELINE, STATIC_THRESHOLD].includes(value.split('.')[0] as ThresholdType);
    }
    return true;
  });
}

export function withoutHistoricBaselineOptions(thresholdTypeOptions: Options = []): Options {
  return thresholdTypeOptions.filter(({ value }) =>
    [ADAPTIVE_BASELINE, STATIC_THRESHOLD].includes(value.split('.')[0] as ThresholdType)
  );
}

export function withoutAdaptiveBaselineOptions(thresholdTypeOptions: Options = []): Options {
  return thresholdTypeOptions.filter(({ value }) =>
    [HISTORIC_BASELINE, STATIC_THRESHOLD].includes(value.split('.')[0] as ThresholdType)
  );
}

const isAdaptiveBaselineOption = (option: Option) => ADAPTIVE_BASELINE === option.value;

/* filter-out any option which does not match depending on the type: (adaptive) or (historic|static) */
export const getOptionsFilterForThresholdTyp = (type: string | ThresholdType): ((option: Option) => boolean) =>
  type === ADAPTIVE_BASELINE //
    ? isAdaptiveBaselineOption
    : (option: Option) => !isAdaptiveBaselineOption(option);
