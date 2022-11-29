/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export type TimeThresholdType =
  | 'violationsInSequence'
  | 'violationsInPeriod'
  | 'userImpactOfViolationsInSequence'
  | 'requestImpact'; // the type value is still requestImpact due to backward compatibility, even though it is about traces

export const timeThresholdTypes = Object.freeze({
  violationsInSequence: 'violationsInSequence',
  violationsInPeriod: 'violationsInPeriod',
  userImpactOfViolationsInSequence: 'userImpactOfViolationsInSequence',
  traceImpact: 'requestImpact' // the type value is requestImpact due to backward compatibility, even though it is about traces
} as const);

export const timeThresholdLabels: Record<TimeThresholdType, string> = {
  violationsInSequence: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdLabelViolationsInSequence'
  ),
  violationsInPeriod: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdLabelViolationsInPeriod'
  ),
  userImpactOfViolationsInSequence: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdLabelUserImpactOfViolationsInSequence'
  ),
  requestImpact: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdLabelTraceImpact'
  )
};
