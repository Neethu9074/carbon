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
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const tabIcmConnections = {
  id: 'icmConnections',
  label: t('in-sap:dashboards.icmConnections')
};
const tabIcmQueue = {
  id: 'icmQueue',
  label: t('in-sap:dashboards.icmQueue')
};
const tabIcmThreads = {
  id: 'icmThreads',
  label: t('in-sap:dashboards.icmThreads')
};
const tabs = [tabIcmConnections, tabIcmQueue, tabIcmThreads];

const metrics = [
  {
    id: 'maxConn',
    label: t('in-sap:dashboards.maximum'),
    value: 'icminfodatastats.maxConn',
    tab: tabIcmConnections.id,
    tabDefault: true
  },
  {
    id: 'peekConn',
    label: t('in-sap:dashboards.peek'),
    value: 'icminfodatastats.peekConn',
    tab: tabIcmConnections.id
  },
  {
    id: 'curConn',
    label: t('in-sap:dashboards.current'),
    value: 'icminfodatastats.curConn',
    tab: tabIcmConnections.id
  },
  {
    id: 'maxQueue',
    label: t('in-sap:dashboards.maximum'),
    value: 'icminfodatastats.maxQueue',
    tab: tabIcmQueue.id
  },
  {
    id: 'peekQueue',
    label: t('in-sap:dashboards.peek'),
    value: 'icminfodatastats.peekQueue',
    tab: tabIcmQueue.id
  },
  {
    id: 'curQueue',
    label: t('in-sap:dashboards.current'),
    value: 'icminfodatastats.curQueue',
    tab: tabIcmQueue.id,
    tabDefault: true
  },
  {
    id: 'maxThr',
    label: t('in-sap:dashboards.maximum'),
    value: 'icminfodatastats.maxThr',
    tab: tabIcmThreads.id
  },
  {
    id: 'peekThr',
    label: t('in-sap:dashboards.peek'),
    value: 'icminfodatastats.peekThr',
    tab: tabIcmThreads.id,
    tabDefault: true
  }
];

interface ICMThreadConnQueueProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

export default function ICMThreadConnQueue({ snapshotId, timeConfig }: ICMThreadConnQueueProps) {
  return (
    <TimeShiftAwareChartSelectorWithUrlState
      cardTitle={t('in-sap:dashboards.icmMetrics')}
      tabs={tabs}
      metrics={metrics}
      urlMatrixParamConfig={{ path: 'icm', paramTab: 'tab', paramMetric: 'metric' }}
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
    icmConnections: ['icminfodatastats.maxConn', 'icminfodatastats.peekConn', 'icminfodatastats.curConn'],
    icmQueue: ['icminfodatastats.maxQueue', 'icminfodatastats.peekQueue', 'icminfodatastats.curQueue'],
    icmThreads: ['icminfodatastats.maxThr', 'icminfodatastats.peekThr']
  };

  const isConnTab = selectedTabId === 'icmConnections';
  const isQueueTab = selectedTabId === 'icmQueue';

  const currentTabMetrics = isConnTab
    ? tabMetricsMap.icmConnections
    : isQueueTab
    ? tabMetricsMap.icmQueue
    : tabMetricsMap.icmThreads;

  const currentTabLabels = [
    t('in-sap:dashboards.maximum'),
    t('in-sap:dashboards.peek'),
    ...(isConnTab || isQueueTab ? [t('in-sap:dashboards.current')] : [])
  ];

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
    <>
      <DashboardSection title={t('in-sap:dashboards.icmMetrics')} button={selectorComponent}>
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
              formatter: number.compact
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
    </>
  );
}
