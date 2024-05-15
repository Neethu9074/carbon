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
      <DashboardSection title={t('in-forge:plugins.ibmInfosphereSubscription.sourceEnginePreFilters')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['preFilterInserts', 'preFilterUpdates', 'preFilterDeletes'],
            labels: [
              t('in-forge:plugins.ibmInfosphereSubscription.preFilterInserts'),
              t('in-forge:plugins.ibmInfosphereSubscription.preFilterUpdates'),
              t('in-forge:plugins.ibmInfosphereSubscription.preFilterDeletes')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmInfosphereSubscription.sourceEnginePostFilters')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['postFilterInserts', 'postFilterUpdates', 'postFilterDeletes'],
            labels: [
              t('in-forge:plugins.ibmInfosphereSubscription.postFilterInserts'),
              t('in-forge:plugins.ibmInfosphereSubscription.postFilterUpdates'),
              t('in-forge:plugins.ibmInfosphereSubscription.postFilterDeletes')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
};

export default IbmInfosphereSubscriptionDashboard;
