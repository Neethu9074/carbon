/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm, ValidationResult } from 'formalistic';

import { TimeThresholdTypeValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import { websiteSmartAlertsAllowPerWindowUserImpact } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export const percentageOfUserDefault = 0.2;
export const numberOfUsersDefault = 20;
const numberOfRequestsDefault = 20;
const timeWindowDefault = 600000;

export const ImpactMeasurementMethods = {
  AGGREGATED: 'AGGREGATED',
  PER_WINDOW: 'PER_WINDOW'
};

type TimeThresholdConfig = {
  timeWindow: number;
  impactMeasurementMethod?: keyof typeof ImpactMeasurementMethods;
  users?: number;
  userPercentage?: number;
  type?: TimeThresholdTypeValue;
  violations?: number;
  requests?: number;
};

export function createViolationsInSequenceForm({ timeWindow }: TimeThresholdConfig) {
  return createMapForm()
    .put(
      'type',
      createField({
        value: 'violationsInSequence'
      })
    )
    .put(
      'timeWindow',
      createField({
        value: timeWindow ?? timeWindowDefault
      })
    );
}

export function createViolationsInPeriodForm({ timeWindow, violations }: TimeThresholdConfig) {
  return createMapForm()
    .put('type', createField({ value: 'violationsInPeriod' }))
    .put('timeWindow', createField({ value: timeWindow ?? timeWindowDefault }))
    .put(
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
}: TimeThresholdConfig): MapForm {
  let form = createMapForm();
  form = form
    .put('type', createField({ value: 'userImpactOfViolationsInSequence' }))
    .put('timeWindow', createField({ value: timeWindow ?? timeWindowDefault }));
  if (websiteSmartAlertsAllowPerWindowUserImpact) {
    form = form.put(
      'impactMeasurementMethod',
      createField({ value: impactMeasurementMethod ?? ImpactMeasurementMethods.AGGREGATED })
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

export function createRequestImpactForm(timeThresholdConfig: TimeThresholdConfig): MapForm {
  return createMapForm()
    .put(
      'type',
      createField({
        value: 'requestImpact'
      })
    )
    .put(
      'timeWindow',
      createField({
        value: timeThresholdConfig.timeWindow ?? timeWindowDefault
      })
    )
    .put(
      'requests',
      createField({
        value: timeThresholdConfig.requests ?? numberOfRequestsDefault,
        validator: provideNumberGreaterEqualsOneValidator
      })
    );
}

export default function createTimeThresholdForm(timeThresholdConfig: TimeThresholdConfig): MapForm | undefined {
  const type = timeThresholdConfig.type ?? 'violationsInSequence';

  if (type === 'violationsInSequence') {
    return createViolationsInSequenceForm(timeThresholdConfig);
  }
  if (type === 'violationsInPeriod') {
    return createViolationsInPeriodForm(timeThresholdConfig);
  }
  if (type === 'userImpactOfViolationsInSequence') {
    return createUserImpactOfViolationsInSequenceForm(timeThresholdConfig);
  }
  if (type === 'requestImpact') {
    return createRequestImpactForm(timeThresholdConfig);
  }
  return undefined;
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
