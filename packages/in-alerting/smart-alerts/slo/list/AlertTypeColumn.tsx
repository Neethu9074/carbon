/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';

import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface AlertTypeColumnProps {
  config: ServiceLevelsAlertConfigWithMetadata;
}

export default function AlertTypeColumn({ config }: AlertTypeColumnProps) {
  const isBurnRateAlert = config.rule.metric === 'BURN_RATE';
  return (
    <DefaultCell
      title={t('in-alerting:smartAlerts.slo.alertList.title', { context: config.rule.metric })}
      subtitle={t('in-alerting:smartAlerts.slo.alertList.threshold', {
        value: isBurnRateAlert ? config.threshold.value : percentage.detailed(config.threshold.value),
        context: config.rule.metric
      })}
    />
  );
}
