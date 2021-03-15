/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import DatabaseSizesTable from './DatabaseSizesTable';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function MongoDBDashboard({ snapshot, timeConfig }) {
  const sensorConnectionProblems = snapshot.getIn(['data', 'sensorConnectionProblems'], emptyList);
  if (sensorConnectionProblems.size > 0) {
    return sensorConnectionProblems.map(problem => (
      <DashboardNotification key={problem} type="info">
        {problem}
      </DashboardNotification>
    ));
  }

  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.mongoDb.connections')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="connections"
            formatter={number.compact}
            timeWindowAggregation="mean"
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.mongoDb.databaseSize')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="totalDbSize"
            formatter={bytes.detailed}
            timeWindowAggregation="mean"
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.mongoDb.databaseActivity')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['documents.returned', 'documents.inserted', 'documents.updated', 'documents.deleted'],
            labels: [
              t('in-forge:plugins.mongoDb.read'),
              t('in-forge:plugins.mongoDb.inserted'),
              t('in-forge:plugins.mongoDb.updated'),
              t('in-forge:plugins.mongoDb.deleted')
            ],
            type: 'stackedBar',
            aggregation: 'sum',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.mongoDb.clients')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['connections'],
            labels: [t('in-forge:plugins.mongoDb.connections')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.mongoDb.memory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['virtual', 'mapped'],
            labels: [t('in-forge:plugins.mongoDb.virtual'), t('in-forge:plugins.mongoDb.mapped')],
            type: 'line',
            formatter: bytes.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DatabaseSizesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
