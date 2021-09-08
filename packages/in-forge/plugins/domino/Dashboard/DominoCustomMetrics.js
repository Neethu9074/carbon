/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function DominoCustomMetrics({ snapshot, timeConfig, titlePrefix }) {
  const metricIds = snapshot.get('metricIds');
  if (metricIds.size > 0) {
    return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} specs={SPECS} />;
  }
  return <DashboardNotification>{t('in-forge:plugins.domino.dashboard.noMetricsDomino')}</DashboardNotification>;
}

export const SPECS = [
  {
    prefix: 'metrics.counters.',
    path: ['data', 'metrics.counters'],
    type: 'counter',
    color: '#00CC66',
    metrics: [
      {
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableCount'),
        formatter: number.detailed
      }
    ]
  }
];
