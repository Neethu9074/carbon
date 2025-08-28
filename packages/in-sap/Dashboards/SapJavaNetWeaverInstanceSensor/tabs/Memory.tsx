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
import { megaBytes, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const tabMemoryUsage = {
  id: 'memoryUsage',
  label: t('in-sap:dashboards.memoryUsage')
};
const tabMemoryRates = {
  id: 'memoryRates',
  label: t('in-sap:dashboards.memoryRates')
};
const tabs = [tabMemoryUsage, tabMemoryRates];

const metrics = [
  {
    id: 'allocated',
    label: t('in-sap:dashboards.allocated'),
    value: 'customMetrics.memory.allocated',
    tab: tabMemoryUsage.id,
    tabDefault: true
  },
  {
    id: 'used',
    label: t('in-sap:dashboards.used'),
    value: 'customMetrics.memory.used',
    tab: tabMemoryUsage.id
  },
  {
    id: 'allocatedRate',
    label: t('in-sap:dashboards.allocatedRate'),
    value: 'customMetrics.memory.allocatedRate',
    tab: tabMemoryRates.id,
    tabDefault: true
  },
  {
    id: 'usedRate',
    label: t('in-sap:dashboards.usedRate'),
    value: 'customMetrics.memory.usedRate',
    tab: tabMemoryRates.id
  }
];

interface MemoryMetricsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

export default function MemoryMetrics({ snapshotId, timeConfig }: MemoryMetricsProps) {
  return (
    <TimeShiftAwareChartSelectorWithUrlState
      cardTitle={t('in-sap:dashboards.memoryMetrics')}
      tabs={tabs}
      metrics={metrics}
      urlMatrixParamConfig={{ path: 'memory', paramTab: 'tab', paramMetric: 'metric' }}
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
  const [cachedChartData, setCachedChartData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const prevTabId = useRef<string | null | undefined>(null);

  const tabMetricsMap = {
    memoryUsage: ['customMetrics.memory.allocated', 'customMetrics.memory.used'],
    memoryRates: ['customMetrics.memory.allocatedRate', 'customMetrics.memory.usedRate']
  };

  const tabLabelsMap = {
    memoryUsage: [t('in-sap:dashboards.allocated'), t('in-sap:dashboards.used')],
    memoryRates: [t('in-sap:dashboards.allocatedRate'), t('in-sap:dashboards.usedRate')]
  };

  const isUsageTab = selectedTabId === 'memoryUsage';
  const formatter = isUsageTab ? megaBytes.detailed : percentage.detailed;

  const currentTabMetrics = selectedTabId ? tabMetricsMap[selectedTabId as keyof typeof tabMetricsMap] : [];
  const currentTabLabels = selectedTabId ? tabLabelsMap[selectedTabId as keyof typeof tabLabelsMap] : [];

  useEffect(() => {
    if (prevTabId.current !== selectedTabId && selectedTabId) {
      setIsLoading(true);

      const loadingTimer = setTimeout(() => {
        setIsLoading(false);

        if (!cachedChartData[selectedTabId]) {
          setCachedChartData(prev => ({
            ...prev,
            [selectedTabId]: {
              metrics: currentTabMetrics,
              labels: currentTabLabels
            }
          }));
        }
      }, 800);

      prevTabId.current = selectedTabId;
      return () => clearTimeout(loadingTimer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabId]);

  const y1Metrics =
    isLoading && prevTabId.current && cachedChartData[prevTabId.current]
      ? cachedChartData[prevTabId.current].metrics
      : currentTabMetrics;

  const y1Labels =
    isLoading && prevTabId.current && cachedChartData[prevTabId.current]
      ? cachedChartData[prevTabId.current].labels
      : currentTabLabels;

  return (
    <DashboardSection title={t('in-sap:dashboards.memoryMetrics')} button={selectorComponent}>
      <div style={{ position: 'relative' }}>
        <Chart
          key={`chart-${snapshotId}`}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: y1Metrics,
            labels: y1Labels,
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
