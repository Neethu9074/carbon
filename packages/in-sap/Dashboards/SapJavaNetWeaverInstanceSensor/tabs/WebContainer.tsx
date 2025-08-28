/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useRef, useState } from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-components/ChartSelectors/ChartSelectors';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { seconds, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const tabAvgProcTime = {
  id: 'avgProcTime',
  label: t('in-sap:dashboards.throughput')
};
const tabError500 = {
  id: 'error500',
  label: t('in-sap:dashboards.error500Count')
};
const tabs = [tabAvgProcTime, tabError500];

const metrics = [
  {
    id: 'avgProcTime',
    label: t('in-sap:dashboards.throughput'),
    value: 'customMetrics.kpi.averageProcessingTime',
    tab: tabAvgProcTime.id,
    tabDefault: true
  },
  {
    id: 'error500',
    label: t('in-sap:dashboards.error500Count'),
    value: 'customMetrics.kpi.error500Count',
    tab: tabError500.id
  }
];

interface WebContainerMetricsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

export default function WebContainerMetrics({ snapshotId, timeConfig }: WebContainerMetricsProps) {
  return (
    <TimeShiftAwareChartSelectorWithUrlState
      cardTitle={t('in-sap:dashboards.webContainer')}
      tabs={tabs}
      metrics={metrics}
      urlMatrixParamConfig={{ path: 'webcontainer', paramTab: 'tab', paramMetric: 'metric' }}
    >
      {/* @ts-expect-error injected props from wrapper */}
      <ChartPresenter snapshotId={snapshotId} timeConfig={timeConfig} />
    </TimeShiftAwareChartSelectorWithUrlState>
  );
}

interface ChartPresenterProps {
  selectedTabId?: string | null;
  selectorComponent: React.ReactElement;
  snapshotId: string;
  timeConfig: TimeConfig;
}

function ChartPresenter({ selectedTabId, selectorComponent, snapshotId, timeConfig }: ChartPresenterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const prevTabId = useRef<string | null | undefined>(null);

  const tabMetricsMap = {
    avgProcTime: ['customMetrics.kpi.averageProcessingTime'],
    error500: ['customMetrics.kpi.error500Count']
  };

  const tabLabelsMap = {
    avgProcTime: [t('in-sap:dashboards.throughput')],
    error500: [t('in-sap:dashboards.error500Count')]
  };

  const formatter = selectedTabId === 'avgProcTime' ? seconds.detailed : number.compact;

  const currentTabMetrics = selectedTabId ? tabMetricsMap[selectedTabId as keyof typeof tabMetricsMap] : [];
  const currentTabLabels = selectedTabId ? tabLabelsMap[selectedTabId as keyof typeof tabLabelsMap] : [];

  useEffect(() => {
    if (prevTabId.current !== selectedTabId && selectedTabId) {
      setIsLoading(true);
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      prevTabId.current = selectedTabId;
      return () => clearTimeout(loadingTimer);
    }
    return undefined;
  }, [selectedTabId]);

  return (
    <DashboardSection title={t('in-sap:dashboards.webContainer')} button={selectorComponent}>
      <div style={{ position: 'relative' }}>
        <Chart
          key={`chart-${snapshotId}-${selectedTabId}`}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: currentTabMetrics,
            labels: currentTabLabels,
            type: 'line',
            formatter
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />

        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 10
            }}
          >
            <LoadingIndicator text={t('in-sap:dashboards.loading')} />
          </div>
        )}
      </div>
    </DashboardSection>
  );
}
