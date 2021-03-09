/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createMapForm, createField } from 'formalistic';

import { t } from 'in-i18n';

export const percentageOfUserDefault = 0.2;
export const numberOfUsersDefault = 20;
const numberOfRequestsDefault = 20;
const timeWindowDefault = 600000;

export function createViolationsInSequenceForm(timeThresholdConfig) {
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
        value: timeThresholdConfig.timeWindow ?? timeWindowDefault
      })
    );
}

export function createViolationsInPeriodForm(timeThresholdConfig) {
  return createMapForm()
    .put(
      'type',
      createField({
        value: 'violationsInPeriod'
      })
    )
    .put(
      'timeWindow',
      createField({
        value: timeThresholdConfig.timeWindow ?? timeWindowDefault
      })
    )
    .put(
      'violations',
      createField({
        value: timeThresholdConfig.violations ?? 1
      })
    );
}

export function createUserImpactOfViolationsInSequenceForm(timeThresholdConfig) {
  let form = createMapForm();
  form = form
    .put(
      'type',
      createField({
        value: 'userImpactOfViolationsInSequence'
      })
    )
    .put(
      'timeWindow',
      createField({
        value: timeThresholdConfig.timeWindow ?? timeWindowDefault
      })
    );

  if (timeThresholdConfig.users) {
    form = putUsersField(form, timeThresholdConfig.users);
  }

  if (timeThresholdConfig.userPercentage || (!timeThresholdConfig.userPercentage && !timeThresholdConfig.users)) {
    form = putUserPercentageField(form, timeThresholdConfig.userPercentage);
  }

  return form;
}

export function createRequestImpactForm(timeThresholdConfig) {
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
        validator: num => {
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
        }
      })
    );
}

export default function createTimeThresholdForm(timeThresholdConfig) {
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
}

export function putUsersField(form, users) {
  return form.put(
    'users',
    createField({
      value: users ?? numberOfUsersDefault,
      validator: num => {
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
      }
    })
  );
}

export function putUserPercentageField(form, userPercentage) {
  return form.put(
    'userPercentage',
    createField({
      value: userPercentage ?? percentageOfUserDefault,
      validator: num => {
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
      }
    })
  );
}
