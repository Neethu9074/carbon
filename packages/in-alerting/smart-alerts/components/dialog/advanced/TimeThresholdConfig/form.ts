/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm, ValidationResult } from 'formalistic';

import {
  ImpactMeasurementMethod,
  ThresholdType,
  ApplicationTimeThresholdUnion,
  WebsiteTimeThresholdUnion,
  TraceImpactApplicationTimeThreshold,
  UserImpactWebsiteTimeThreshold,
  ViolationsInSequenceApplicationTimeThreshold,
  ViolationsInSequenceWebsiteTimeThreshold,
  ViolationsInPeriodApplicationTimeThreshold,
  ViolationsInPeriodWebsiteTimeThreshold,
  ViolationsInSequenceInfraTimeThreshold,
  ViolationsInSequenceLogTimeThreshold
} from 'in-types';
import { TimeThresholdType } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { defaultGranularity } from 'in-alerting/PotentialProblems/constants';
import { t } from 'in-i18n';

export const percentageOfUserDefault = 0.2;
export const numberOfUsersDefault = 20;
const numberOfRequestsDefault = 20;
export const defaultTimeWindow = 600000;
export const defaultAdaptiveBaselineTimeWindow = 1200000;

export const ImpactMeasurementMethods: Record<ImpactMeasurementMethod, ImpactMeasurementMethod> = {
  AGGREGATED: 'AGGREGATED',
  PER_WINDOW: 'PER_WINDOW'
};

export function getDefaultTimeWindow(thresholdType: ThresholdType | undefined) {
  return thresholdType === ADAPTIVE_BASELINE ? defaultAdaptiveBaselineTimeWindow : defaultTimeWindow;
}

/**
 * Creates the form for the specific threshold config depending on
 * its type.
 *
 * @param timeThresholdConfig has a different fields depending on its type
 * @param granularity only for trace impact (requestImpact) option: used as the default windowType, fallback is defaultGranularity
 * @param thresholdType type of threshold ('staticThreshold' | 'historicBaseline' | 'adaptiveBaseline' | undefined)
 */
export default function createTimeThresholdForm(
  timeThresholdConfig?: ApplicationTimeThresholdUnion | WebsiteTimeThresholdUnion,
  granularity?: number,
  thresholdType?: ThresholdType
): MapForm<any> {
  switch (timeThresholdConfig?.type) {
    case 'violationsInPeriod':
      return createViolationsInPeriodForm(timeThresholdConfig, thresholdType);
    case 'userImpactOfViolationsInSequence':
      return createUserImpactOfViolationsInSequenceForm(timeThresholdConfig, thresholdType);
    case 'requestImpact':
      return createTraceImpactForm(timeThresholdConfig, granularity, thresholdType);
    case 'violationsInSequence':
    default:
      return createViolationsInSequenceForm(timeThresholdConfig, thresholdType);
  }
}

function createMapBase(type: TimeThresholdType, thresholdType?: ThresholdType, timeWindow?: number) {
  return createMapForm()
    .put('type', createField({ value: type }))
    .put(
      'timeWindow',
      createField({
        value: timeWindow ?? getDefaultTimeWindow(thresholdType),
        validator: provideNumberGreaterEqualsOneValidator
      })
    );
}

export function createViolationsInPeriodForm(
  { timeWindow, violations }: ViolationsInPeriodApplicationTimeThreshold | ViolationsInPeriodWebsiteTimeThreshold,
  thresholdType: ThresholdType | undefined
): MapForm<any> {
  return createMapBase('violationsInPeriod', thresholdType, timeWindow).put(
    'violations',
    createField({
      value: violations ?? 1,
      validator: provideNumberGreaterEqualsOneValidator
    })
  );
}

export function createUserImpactOfViolationsInSequenceForm(
  { timeWindow, impactMeasurementMethod, userPercentage, users }: UserImpactWebsiteTimeThreshold,
  thresholdType?: ThresholdType
): MapForm<any> {
  let form: MapForm<any> = createMapBase('userImpactOfViolationsInSequence', thresholdType, timeWindow);

  form = form.put(
    'impactMeasurementMethod',
    createField({
      value: impactMeasurementMethod ?? ImpactMeasurementMethods.AGGREGATED
    })
  );

  if (users) {
    form = putUsersField(form, users);
  }

  if (userPercentage || (!userPercentage && !users)) {
    form = putUserPercentageField(form, userPercentage);
  }

  return form;
}

export function createTraceImpactForm(
  { requests }: TraceImpactApplicationTimeThreshold,
  granularity?: number,
  thresholdType?: ThresholdType
): MapForm<any> {
  // For request impact timeWindow is always one bucket which means it would be same as granularity.
  return createMapBase('requestImpact', thresholdType, granularity ?? defaultGranularity).put(
    'requests',
    createField({
      value: requests ?? numberOfRequestsDefault,
      validator: provideNumberGreaterEqualsOneValidator
    })
  );
}

export function createViolationsInSequenceForm(
  timeThresholdConfig?:
    | ViolationsInSequenceApplicationTimeThreshold
    | ViolationsInSequenceWebsiteTimeThreshold
    | ViolationsInSequenceInfraTimeThreshold
    | ViolationsInSequenceLogTimeThreshold,
  thresholdType?: ThresholdType
) {
  return createMapBase('violationsInSequence', thresholdType, timeThresholdConfig?.timeWindow);
}

const provideNumberGreaterEqualsOneValidator = (num: number | string): ValidationResult => {
  if (num === '' || Number(num) < 1) {
    return [
      {
        severity: 'error',
        message: t(
          'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigErrorPleaseProvideANumberGreaterEqualsToOne'
        )
      }
    ];
  }
  return null;
};

export function putUsersField(form: MapForm<any>, users?: number | '') {
  return form.put(
    'users',
    createField({
      value: users ?? numberOfUsersDefault,
      validator: provideNumberGreaterEqualsOneValidator
    })
  );
}

export function putUserPercentageField(form: MapForm<any>, userPercentage?: number | '') {
  return form.put(
    'userPercentage',
    createField({
      value: userPercentage ?? percentageOfUserDefault,
      validator: (num: number | string): ValidationResult => {
        if (num === '' || Number(num) < 0.01 || Number(num) > 1.0) {
          return [
            {
              severity: 'error',
              message: t(
                'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigErrorPleaseProvideANumberBetween1and100Percent'
              )
            }
          ];
        }
        return null;
      }
    })
  );
}
