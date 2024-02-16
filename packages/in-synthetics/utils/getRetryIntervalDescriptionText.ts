/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export const getRetryIntervalDescriptionText = (retriesFieldValue: number, retryIntervalFieldValue: number) => {
  return t('in-synthetics:dialog.createTest.advancedMode.configStep.retryIntervalDescription', {
    retryCount: retriesFieldValue === 1 ? 'once' : 'twice',
    retryIntervalValue: retryIntervalFieldValue,
    retryIntervalUnit: retryIntervalFieldValue > 1 ? 'seconds' : 'second'
  });
};
