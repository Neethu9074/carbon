import { minutesToMillis } from 'in-new-components/Alerting/utils/formatUtils';

export const timeThresholdTypes = Object.freeze({
  violationsInSequence: 'violationsInSequence',
  violationsInPeriod: 'violationsInPeriod',
  userImpactOfViolationsInSequence: 'userImpactOfViolationsInSequence'
});

export const tenMinutesConditionTime = { value: minutesToMillis(10), label: '10 min' };

export const conditionPersistenceTimes = Object.freeze([
  { value: minutesToMillis(1), label: '1 min', for1minGranularity: true },
  { value: minutesToMillis(2), label: '2 min', for1minGranularity: true },
  { value: minutesToMillis(5), label: '5 min', for1minGranularity: true },
  tenMinutesConditionTime,
  { value: minutesToMillis(20), label: '20 min' },
  { value: minutesToMillis(30), label: '30 min' },
  { value: minutesToMillis(60), label: '60 min' },
  { value: minutesToMillis(90), label: '90 min' },
  { value: minutesToMillis(120), label: '120 min' }
]);
