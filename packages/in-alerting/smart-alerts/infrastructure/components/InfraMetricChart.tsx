/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { selectedMetricGroup$ } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import InfraAlertChartWrapper from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { ChartSkeleton } from 'in-alerting/smart-alerts/components/ChartSkeleton';
import { Nullish } from 'in-types';
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
}

export function InfraMetricChart({
  alertConfig,
  timeConfig,
  groupBy,
  entityType,
  metricName,
  alertsPreviewEnabled = false,
  metricLabel
}: InfraMetricChartProps) {
  const selectedMetricGroup = useObservable(selectedMetricGroup$, []) as Tags | Nullish;

  if (selectedMetricGroup?.loading) {
    return <ChartSkeleton />;
  }

  if ((!selectedMetricGroup && groupBy.length > 0) || (!entityType && !metricName)) {
    return (
      <Message withIcon fullInlineWidth>
        {t('in-alerting:smartAlerts.infrastructure.form.noMetricSelected')}
      </Message>
    );
  } else if (groupBy.length === 0 && entityType && metricName) {
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
      <div className={local.container}>
        {t('in-alerting:components.previewFor')}
        <h4 className={local.space}> {(chartPreviewName as string[])?.join(', ')}</h4>
      </div>

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
