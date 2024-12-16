/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DurationDistribution from 'in-bizops/dashboards/activity/tabs/summary/components/DurationDistribution';
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-components/ChartSelectors/ChartSelectors';
import DurationOverTime from 'in-bizops/dashboards/activity/tabs/summary/components/DurationOverTime';
import { businessActivityPath } from 'in-bizops/navigation/paths';
import { t } from 'in-i18n';

// Tabs to swap between within widget
const tabOverTime = {
  id: 'overTime',
  label: t('in-applications:labelOverTime')
};
const tabDistribution = {
  id: 'dist',
  label: t('in-applications:labelDistribution')
};
const tabs = [tabOverTime, tabDistribution];

// Displayed metrics on both graphs, each is a backend request
const metrics = [
  {
    id: 'p50',
    label: t('in-mobile-apps:dashboard.tabs.50thLabel'),
    value: 'P50',
    tab: tabOverTime.id,
    tabDefault: true
  },
  {
    id: 'p90',
    label: t('in-mobile-apps:dashboard.tabs.90thLabel'),
    value: 'P90',
    tab: tabOverTime.id
  },
  {
    id: 'p95',
    label: t('in-mobile-apps:dashboard.tabs.95thLabel'),
    value: 'P95',
    tab: tabOverTime.id
  },
  {
    id: 'p99',
    label: t('in-mobile-apps:dashboard.tabs.99thLabel'),
    value: 'P99',
    tab: tabOverTime.id
  },
  {
    id: 'max',
    label: t('in-mobile-apps:dashboard.tabs.maxLabel'),
    value: 'MAX',
    tab: tabOverTime.id
  },
  {
    id: 'mean',
    label: t('in-mobile-apps:dashboard.tabs.meanLabel'),
    value: 'MEAN',
    tab: tabOverTime.id
  },
  {
    id: 'dist',
    label: t('in-applications:labelDistribution'),
    value: 'DISTRIBUTION',
    tab: tabDistribution.id,
    tabDefault: true
  }
];

export default function DurationAndDistribution() {
  const urlMatrixParamConfig = {
    path: businessActivityPath,
    paramTab: 'durationTab',
    paramMetric: 'durationMetric'
  };

  return (
    <TimeShiftAwareChartSelectorWithUrlState
      cardTitle={t('in-bizops:dashboards.activity.widgets.duration')}
      tabs={tabs}
      metrics={metrics}
      urlMatrixParamConfig={urlMatrixParamConfig}
    >
      {/* @ts-expect-error selectedTab comes from non-ts import*/}
      <ChartPresenter />
    </TimeShiftAwareChartSelectorWithUrlState>
  );
}

interface ChartPresenterProps {
  selectedTabId?: string | null | undefined;
  selectorComponent: React.ReactElement;
}

// Display the chart that the user has selected
function ChartPresenter({ selectedTabId, selectorComponent }: ChartPresenterProps) {
  return selectedTabId === tabOverTime.id ? (
    <DurationOverTime rightHeaderContent={selectorComponent} />
  ) : (
    <DurationDistribution rightHeaderContent={selectorComponent} />
  );
}
