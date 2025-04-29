/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Message } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import InfraAlertChartWrapper from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { ChartSkeleton } from 'in-alerting/smart-alerts/components/ChartSkeleton';
import { t } from 'in-i18n';

import local from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricChart.mless';

interface InfraMetricChartProps {
  alertConfig: InfraSmartAlertConfigWithMetadata;
  timeConfig: TimeConfig;
  groupBy: string[];
  entityType: string;
  metricName: string;
  alertsPreviewEnabled?: boolean;
  metricLabel: string;
  selectedMetricGroup: Tags | null;
}

export function InfraMetricChart({
  alertConfig,
  timeConfig,
  groupBy,
  entityType,
  metricName,
  alertsPreviewEnabled = false,
  metricLabel,
  selectedMetricGroup
}: InfraMetricChartProps) {
  if (selectedMetricGroup?.loading) {
    return <ChartSkeleton />;
  }

  const isCustomEvaluationType = alertConfig.evaluationType === 'CUSTOM';

  if ((!selectedMetricGroup && groupBy.length > 0) || (!entityType && !metricName)) {
    return (
      <Message withIcon fullInlineWidth>
        {t('in-alerting:smartAlerts.infrastructure.form.noMetricSelected')}
      </Message>
    );
  } else if (isCustomEvaluationType && groupBy.length === 0 && entityType && metricName) {
    return (
      <InfraAlertChartWrapper
        alertConfig={alertConfig}
        timeConfig={timeConfig}
        alertsPreviewEnabled={alertsPreviewEnabled}
        metricLabel={metricLabel}
      />
    );
  }

  let chartPreviewName =
    selectedMetricGroup &&
    Object.entries(selectedMetricGroup).map(([, value]) => {
      return value;
    });

  return (
    <div className={local.minHeight}>
      {isCustomEvaluationType && (
        <div className={local.container}>
          {t('in-alerting:components.previewFor')}
          <h4 className={local.space}> {(chartPreviewName as string[])?.join(', ')}</h4>
        </div>
      )}

      <InfraAlertChartWrapper
        alertConfig={alertConfig}
        timeConfig={timeConfig}
        selectedMetricGroup={selectedMetricGroup ?? undefined}
        alertsPreviewEnabled={alertsPreviewEnabled}
        metricLabel={metricLabel}
      />
    </div>
  );
}
