/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AlertThresholdInfosProps } from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/synthetics/details/AlertThresholdInfos';
import { t } from 'in-i18n';

const thresholdInfos: AlertThresholdInfosProps = {
  thresholdType: t('in-alerting:smartAlerts.synthetics.details.noOfFailure'),
  failureThreshold: t('in-alerting:smartAlerts.synthetics.details.failureThreshold', {
    failureCount: 1
  }),
  aggregation: t('in-alerting:smartAlerts.synthetics.details.scope.perLocation.shortText')
};

export default {
  component: AlertThresholdInfos
};

export const Default = {
  args: {
    thresholdInfos
  }
};
