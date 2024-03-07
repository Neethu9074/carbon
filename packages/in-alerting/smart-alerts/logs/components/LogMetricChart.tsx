/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { isEmpty } from 'lodash';
import React from 'react';

import { LogAlertConfigWithMetadata, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';

import LogAlertChartWrapper from 'in-alerting/smart-alerts/logs/components/LogAlertChartWrapper';
import { selectedMetricGroup$ } from 'in-alerting/smart-alerts/logs/details/AlertConfiguration';
import { Tags } from 'in-alerting/smart-alerts/logs/details/AlertConfiguration';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import local from 'in-alerting/smart-alerts/logs/components/LogMetricChart.mless';

interface LogMetricChartProps {
  alertConfig: LogAlertConfigWithMetadata;
  timeConfig: TimeConfig;
}

export function LogMetricChart({ alertConfig, timeConfig }: LogMetricChartProps) {
  const { groupBy } = alertConfig;
  const selectedMetricGroup = useObservable(selectedMetricGroup$, []) as Tags | Nullish;
  let chartPreviewName =
    selectedMetricGroup &&
    Object.entries(selectedMetricGroup).map(([, value]) => {
      return value;
    });

  if (!selectedMetricGroup && !isEmpty(groupBy)) {
    return (
      <div className={local.minHeight}>
        <Message withIcon>{t('in-alerting:smartAlerts.logs.form.noMetricSelected')}</Message>
      </div>
    );
  }

  return (
    <div className={local.minHeight}>
      {groupBy && (
        <div className={local.container}>
          {t('in-alerting:components.previewFor')}
          <h4 className={local.space}> {(chartPreviewName as string[])?.join(', ')}</h4>
        </div>
      )}

      <LogAlertChartWrapper
        alertConfig={alertConfig}
        timeConfig={timeConfig}
        selectedMetricGroup={selectedMetricGroup ?? undefined}
      />
    </div>
  );
}
