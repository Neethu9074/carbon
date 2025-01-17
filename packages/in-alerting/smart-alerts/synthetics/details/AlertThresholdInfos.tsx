/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/synthetics/details/AlertThresholdInfosPresenter';
import { AlertThresholdInfosProps } from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration';
import { t } from 'in-i18n';

export const AlertThresholdInfos = ({ thresholdInfos }: { thresholdInfos: AlertThresholdInfosProps }) => {
  const thresholdTypeLabel = thresholdInfos.thresholdType;
  const metricWithThresholdLabel = thresholdInfos.failureThreshold;
  const gracePeriod = thresholdInfos.gracePeriod;

  return (
    <AlertThresholdInfosPresenter
      thresholdTypeLabel={thresholdTypeLabel}
      metricLabel={metricWithThresholdLabel}
      scopeLabel={t('in-alerting:smartAlerts.synthetics.details.scope.perLocation.shortText')}
      gracePeriod={gracePeriod}
    />
  );
};
