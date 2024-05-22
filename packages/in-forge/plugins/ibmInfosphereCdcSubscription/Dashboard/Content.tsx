/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

//@ts-expect-error
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface IbmInfosphereSubscriptionDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const IbmInfosphereSubscriptionDashboard = ({ snapshot, timeConfig }: IbmInfosphereSubscriptionDashboardProps) => {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEnginePreFilters')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['preFilterInserts', 'preFilterUpdates', 'preFilterDeletes'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.preFilterInserts'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.preFilterUpdates'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.preFilterDeletes')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEnginePostFilters')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['postFilterInserts', 'postFilterUpdates', 'postFilterDeletes'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.postFilterInserts'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.postFilterUpdates'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.postFilterDeletes')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApplyFilters')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['targetApplyInserts', 'targetApplyUpdates', 'targetApplyDeletes'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApplyInserts'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApplyUpdates'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApplyDeletes')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngineFilters')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['targetEngineInserts', 'targetEngineUpdates', 'targetEngineDeletes'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngineInserts'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngineUpdates'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngineDeletes')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.logParser')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['logParserDiskRead', 'logParserDiskWrite', 'logParserDiskSize'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.diskReads'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.diskWrites'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.diskSize')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.logReader')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['logSourceDBProcessed', 'logPhysicalBytesRead'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.databaseBytesProcessed'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.physicalBytesRead')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.logReader')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['logThreadCpu'],
            labels: [t('in-forge:plugins.ibmInfosphereCdcSubscription.threadCpu')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
};

export default IbmInfosphereSubscriptionDashboard;
