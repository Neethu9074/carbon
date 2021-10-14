/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export type TimeThresholdTypeValue =
  | 'violationsInSequence'
  | 'violationsInPeriod'
  | 'userImpactOfViolationsInSequence'
  | 'requestImpact';

export const timeThresholdTypes: Record<TimeThresholdTypeValue, TimeThresholdTypeValue> = Object.freeze({
  violationsInSequence: 'violationsInSequence',
  violationsInPeriod: 'violationsInPeriod',
  userImpactOfViolationsInSequence: 'userImpactOfViolationsInSequence',
  requestImpact: 'requestImpact'
});
