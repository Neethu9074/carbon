import { createMapForm, createField } from 'formalistic';

const numberOfUsersDefault = 20;
const numberOfRequestsDefault = 20;
const percentageOfUserDefault = 0.2;
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
  return createMapForm()
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
    )
    .put(
      'users',
      createField({
        value: timeThresholdConfig.users ?? numberOfUsersDefault,
        validator: num => {
          if (num === '' || num < 1) {
            return [
              {
                severity: 'error',
                message: 'Please provide a number >= 1'
              }
            ];
          }
        }
      })
    )
    .put(
      'userPercentage',
      createField({
        value: timeThresholdConfig.userPercentage ?? percentageOfUserDefault,
        validator: num => {
          if (num === '' || num < 0.01 || num > 1.0) {
            return [
              {
                severity: 'error',
                message: 'Please provide a number between 1% and 100%'
              }
            ];
          }
        }
      })
    );
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
                message: 'Please provide a number >= 1'
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
