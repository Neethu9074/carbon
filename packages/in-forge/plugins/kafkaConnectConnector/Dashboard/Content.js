/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import TasksTable from 'in-forge/plugins/kafkaConnectConnector/Dashboard/TasksTable.js';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';

export default function KafkaConnectWorkerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.kafkaConnectConnector.connectorTasks')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [
              'connectorTotalTaskCount',
              'connectorRunningTaskCount',
              'connectorFailedTaskCount',
              'connectorDestroyedTaskCount',
              'connectorPausedTaskCount',
              'connectorUnassignedTaskCount'
            ],
            labels: [
              t('in-forge:plugins.kafkaConnectConnector.total'),
              t('in-forge:plugins.kafkaConnectConnector.running'),
              t('in-forge:plugins.kafkaConnectConnector.failed'),
              t('in-forge:plugins.kafkaConnectConnector.destroyed'),
              t('in-forge:plugins.kafkaConnectConnector.paused'),
              t('in-forge:plugins.kafkaConnectConnector.unassigned')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <TasksTable connectorId={snapshotId} timeConfig={timeConfig} connectorType={data.get('connectorType')} />
    </div>
  );
}
