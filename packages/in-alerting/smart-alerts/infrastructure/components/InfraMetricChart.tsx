/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { InfraAlertConfigWithMetadata, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';

import { selectedMetricGroup$ } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import InfraAlertChartWrapper from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { alertConfigWithDefaultThreshold } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { t } from 'in-i18n';

import local from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricChart.mless';

interface InfraMetricChartProps {
  form: MapForm<any>;
  timeConfig: TimeConfig;
}

export function InfraMetricChart({ form, timeConfig }: InfraMetricChartProps) {
  const selectedMetricGroup = useObservable(selectedMetricGroup$, []);
  const alertConfigWithFormModel = alertConfigWithDefaultThreshold(form) as InfraAlertConfigWithMetadata;

  if (!selectedMetricGroup) {
    return (
      <div className={local.minHeight}>
        <Message withIcon>{t('in-alerting:smartAlerts.infrastructure.form.noMetricSelected')}</Message>
      </div>
    );
  }

  let chartPreviewName = Object.entries(selectedMetricGroup).map(([, value]) => {
    return value;
  });

  return (
    <div className={local.minHeight}>
      <div className={local.container}>
        {t('in-alerting:smartAlerts.infrastructure.previewFor')}
        <h4 className={local.space}> {chartPreviewName.join(', ')}</h4>
      </div>

      <InfraAlertChartWrapper
        alertConfig={alertConfigWithFormModel}
        timeConfig={timeConfig}
        selectedMetricGroup={selectedMetricGroup}
      />
    </div>
  );
}
