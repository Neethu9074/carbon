/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-components/ChartSelectors/ChartSelectors';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number } from 'in-services/formatters/number';
import { TimeConfig } from 'in-types';
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
  const isConnTab = selectedTabId === 'icmConnections';
  const isQueueTab = selectedTabId === 'icmQueue';

  const y1Metrics = isConnTab
    ? ['icminfodatastats.maxConn', 'icminfodatastats.peekConn', 'icminfodatastats.curConn']
    : isQueueTab
    ? ['icminfodatastats.maxQueue', 'icminfodatastats.peekQueue', 'icminfodatastats.curQueue']
    : ['icminfodatastats.maxThr', 'icminfodatastats.peekThr'];

  const y1Labels = [
    t('in-sap:dashboards.maximum'),
    t('in-sap:dashboards.peek'),
    ...(isConnTab || isQueueTab ? [t('in-sap:dashboards.current')] : [])
  ];

  return (
    <>
      <DashboardSection title={t('in-sap:dashboards.icmMetrics')} button={selectorComponent}>
        <Chart
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
      </DashboardSection>
    </>
  );
}
