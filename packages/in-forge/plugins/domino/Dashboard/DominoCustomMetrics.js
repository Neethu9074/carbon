/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { t } from 'in-i18n';

export default function DominoCustomMetrics({ snapshot, timeConfig, titlePrefix }) {
  const metricIds = snapshot.get('metricIds');
  if (metricIds.size > 0) {
    return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} specs={SPECS} />;
  }
  return <DashboardNotification>{t('in-forge:plugins.domino.dashboard.noMetricsDomino')}</DashboardNotification>;
}

export const SPECS = [AVAILABLE_SPECS.COUNTER];
