/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm, ValidationResult } from 'formalistic';

import { TimeThresholdType } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { defaultGranularity } from 'in-alerting/PotentialProblems/constants';
import { ImpactMeasurementMethod, ThresholdType } from 'in-types';
import { t } from 'in-i18n';

export const percentageOfUserDefault = 0.2;
export const numberOfUsersDefault = 20;
const numberOfRequestsDefault = 20;
const defaultTimeWindow = 600000;
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
  timeThresholdConfig: TimeThresholdConfig,
  granularity: number,
  thresholdType: ThresholdType | undefined
): MapForm {
  switch (timeThresholdConfig?.type) {
    case 'violationsInPeriod':
      return createViolationsInPeriodForm(timeThresholdConfig as ViolationsInPeriodTimeThreshold, thresholdType);
    case 'userImpactOfViolationsInSequence':
      return createUserImpactOfViolationsInSequenceForm(timeThresholdConfig as UserImpactTimeThreshold, thresholdType);
    case 'requestImpact':
      return createTraceImpactForm(timeThresholdConfig as TraceImpactTimeThreshold, granularity, thresholdType);
    case 'violationsInSequence':
    default:
      return createViolationsInSequenceForm(timeThresholdConfig as ViolationsInSequenceTimeThreshold, thresholdType);
  }
}

interface TimeThresholdConfig {
  timeWindow: number;
  type: TimeThresholdType;
}

interface TraceImpactTimeThreshold extends TimeThresholdConfig {
  requests?: number;
}

interface UserImpactTimeThreshold extends TimeThresholdConfig {
  impactMeasurementMethod?: ImpactMeasurementMethod;
  users?: number;
  userPercentage?: number;
}

interface ViolationsInPeriodTimeThreshold extends TimeThresholdConfig {
  violations?: number;
}

interface ViolationsInSequenceTimeThreshold extends TimeThresholdConfig {}

function createMapBase(
  type: TimeThresholdType,
  thresholdType: ThresholdType | undefined,
  timeWindow?: number | undefined
) {
  return createMapForm()
    .put('type', createField({ value: type }))
    .put('timeWindow', createField({ value: timeWindow ?? getDefaultTimeWindow(thresholdType) }));
}

export function createViolationsInPeriodForm(
  { timeWindow, violations }: ViolationsInPeriodTimeThreshold,
  thresholdType: ThresholdType | undefined
): MapForm {
  return createMapBase('violationsInPeriod', thresholdType, timeWindow).put(
    'violations',
    createField({
      value: violations ?? 1
    })
  );
}

export function createUserImpactOfViolationsInSequenceForm(
  { timeWindow, impactMeasurementMethod, userPercentage, users }: UserImpactTimeThreshold,
  thresholdType: ThresholdType | undefined
): MapForm {
  let form = createMapBase('userImpactOfViolationsInSequence', thresholdType, timeWindow);

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
  { requests }: TraceImpactTimeThreshold,
  granularity: number,
  thresholdType: ThresholdType | undefined
): MapForm {
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
  timeThresholdConfig: ViolationsInSequenceTimeThreshold | undefined,
  thresholdType: ThresholdType | undefined
) {
  return createMapBase('violationsInSequence', thresholdType, timeThresholdConfig?.timeWindow);
}

const provideNumberGreaterEqualsOneValidator = (num: number | string): ValidationResult => {
  if (num === '' || num < 1) {
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

export function putUsersField(form: MapForm, users?: number | '' | undefined) {
  return form.put(
    'users',
    createField({
      value: users ?? numberOfUsersDefault,
      validator: provideNumberGreaterEqualsOneValidator
    })
  );
}

export function putUserPercentageField(form: MapForm, userPercentage?: number | '' | undefined) {
  return form.put(
    'userPercentage',
    createField({
      value: userPercentage ?? percentageOfUserDefault,
      validator: (num: number | string): ValidationResult => {
        if (num === '' || num < 0.01 || num > 1.0) {
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
