/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';

import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import { t } from 'in-i18n';

interface AlertTypeColumnProps {
  config: ServiceLevelsAlertConfigWithMetadata;
}

export default function SloAppliedColumn({ config }: AlertTypeColumnProps) {
  const { sloIds } = config;
  return (
    <DefaultCell
      title={t('in-alerting:smartAlerts.slo.alertList.sloCount', {
        count: sloIds.length
      })}
      subtitle={t('in-alerting:smartAlerts.slo.alertList.sloApplied')}
    />
  );
}
