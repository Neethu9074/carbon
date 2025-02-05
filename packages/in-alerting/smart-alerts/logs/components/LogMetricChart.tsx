/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { isEmpty } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import LogAlertChartWrapper from 'in-alerting/smart-alerts/logs/components/LogAlertChartWrapper';
import { selectedMetricGroup$ } from 'in-alerting/smart-alerts/logs/details/AlertConfiguration';
import { SelectedMetric } from 'in-events/components/EventContent/tagFilterUtils';
import { t } from 'in-i18n';

import local from 'in-alerting/smart-alerts/logs/components/LogMetricChart.mless';

interface LogMetricChartProps {
  alertConfig: LogSmartAlertConfigWithMetadata;
  timeConfig: TimeConfig;
}

export function LogMetricChart({ alertConfig, timeConfig }: LogMetricChartProps) {
  const { groupBy } = alertConfig;
  const selectedMetricGroup = useObservable(selectedMetricGroup$, []) as SelectedMetric;
  const chartPreviewName = selectedMetricGroup?.groupbyValue ?? '';

  if (!selectedMetricGroup && !isEmpty(groupBy)) {
    return (
      <div className={local.minHeight}>
        <Message withIcon fullInlineWidth>
          {t('in-alerting:smartAlerts.logs.form.noDataForSelectedGroup')}
        </Message>
      </div>
    );
  }

  return (
    <div className={local.minHeight}>
      {groupBy && (
        <div className={local.container}>
          {t('in-alerting:components.previewFor')}
          <h4 className={local.space}> {chartPreviewName}</h4>
        </div>
      )}

      <LogAlertChartWrapper
        alertConfig={alertConfig}
        timeConfig={timeConfig}
        selectedMetricGroup={selectedMetricGroup ?? undefined}
        alertsPreviewEnabled
      />
    </div>
  );
}
