/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export type TimeThresholdType =
  | 'violationsInSequence'
  | 'violationsInPeriod'
  | 'userImpactOfViolationsInSequence'
  | 'requestImpact';

export const timeThresholdTypes: Record<TimeThresholdType, TimeThresholdType> = Object.freeze({
  violationsInSequence: 'violationsInSequence',
  violationsInPeriod: 'violationsInPeriod',
  userImpactOfViolationsInSequence: 'userImpactOfViolationsInSequence',
  requestImpact: 'requestImpact'
});

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
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdLabelRequestImpact'
  )
};
