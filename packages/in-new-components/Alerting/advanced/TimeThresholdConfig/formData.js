export const timeThresholdTypes = Object.freeze({
  violationsInSequence: 'violationsInSequence',
  violationsInPeriod: 'violationsInPeriod',
  userImpactOfViolationsInSequence: 'userImpactOfViolationsInSequence'
});

export const conditionPersistenceTimes = Object.freeze([
  { value: 600000, label: '10 min' },
  { value: 1200000, label: '20 min' },
  { value: 1800000, label: '30 min' },
  { value: 3600000, label: '60 min' },
  { value: 5400000, label: '90 min' },
  { value: 7200000, label: '120 min' }
]);
