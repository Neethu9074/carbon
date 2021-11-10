/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm, ValidationResult } from 'formalistic';

import { TimeThresholdType } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import { websiteSmartAlertsAllowPerWindowUserImpact } from 'in-services/featureFlags';
import { defaultGranularity } from 'in-alerting/PotentialProblems/constants';
import { ImpactMeasurementMethod } from 'in-types';
import { t } from 'in-i18n';

export const percentageOfUserDefault = 0.2;
export const numberOfUsersDefault = 20;
const numberOfRequestsDefault = 20;
const timeWindowDefault = 600000;

export const ImpactMeasurementMethods: Record<ImpactMeasurementMethod, ImpactMeasurementMethod> = {
  AGGREGATED: 'AGGREGATED',
  PER_WINDOW: 'PER_WINDOW'
};

/**
 * Creates the form for the specific threshold config depending on
 * its type.
 *
 * @param timeThresholdConfig has a different fields depending on its type
 * @param granularity only for requestImpact: used as the default windowType, fallback is defaultGranularity
 */
export default function createTimeThresholdForm(
  timeThresholdConfig: TimeThresholdConfig,
  granularity: number
): MapForm {
  switch (timeThresholdConfig.type) {
    case 'violationsInPeriod':
      return createViolationsInPeriodForm(timeThresholdConfig as ViolationsInPeriodTimeThreshold);
    case 'userImpactOfViolationsInSequence':
      return createUserImpactOfViolationsInSequenceForm(timeThresholdConfig as UserImpactTimeThreshold);
    case 'requestImpact':
      return createRequestImpactForm(timeThresholdConfig as RequestImpactTimeThreshold, granularity);
    case 'violationsInSequence':
    default:
      return createViolationsInSequenceForm(timeThresholdConfig as ViolationsInSequenceTimeThreshold);
  }
}

interface TimeThresholdConfig {
  timeWindow: number;
  type: TimeThresholdType;
}

interface RequestImpactTimeThreshold extends TimeThresholdConfig {
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

function createMapBase(type: TimeThresholdType, timeWindow?: number | undefined) {
  return createMapForm()
    .put('type', createField({ value: type }))
    .put('timeWindow', createField({ value: timeWindow ?? timeWindowDefault }));
}

export function createViolationsInPeriodForm({ timeWindow, violations }: ViolationsInPeriodTimeThreshold): MapForm {
  return createMapBase('violationsInPeriod', timeWindow).put(
    'violations',
    createField({
      value: violations ?? 1
    })
  );
}

export function createUserImpactOfViolationsInSequenceForm({
  timeWindow,
  impactMeasurementMethod,
  userPercentage,
  users
}: UserImpactTimeThreshold): MapForm {
  let form = createMapBase('userImpactOfViolationsInSequence', timeWindow);

  if (websiteSmartAlertsAllowPerWindowUserImpact) {
    form = form.put(
      'impactMeasurementMethod',
      createField({
        value: impactMeasurementMethod ?? ImpactMeasurementMethods.AGGREGATED
      })
    );
  }

  if (users) {
    form = putUsersField(form, users);
  }

  if (userPercentage || (!userPercentage && !users)) {
    form = putUserPercentageField(form, userPercentage);
  }

  return form;
}

export function createRequestImpactForm({ requests }: RequestImpactTimeThreshold, granularity: number): MapForm {
  // For request impact timeWindow is always one bucket which means it would be same as granularity.
  return createMapBase('requestImpact', granularity ?? defaultGranularity) //
    .put(
      'requests',
      createField({
        value: requests ?? numberOfRequestsDefault,
        validator: provideNumberGreaterEqualsOneValidator
      })
    );
}

export function createViolationsInSequenceForm(thresholdConfig: ViolationsInSequenceTimeThreshold) {
  return createMapBase('violationsInSequence', thresholdConfig.timeWindow);
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
