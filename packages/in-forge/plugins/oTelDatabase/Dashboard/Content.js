/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import { number, bytesTwoDecimalPlaces, seconds } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function OTelDatabaseDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.session')}>
          <MetricValue snapshotId={snapshot.get('id')} metric="db.session.count" formatter={number.compact} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.transaction')}>
          <MetricValue snapshotId={snapshot.get('id')} metric="db.transaction.count" formatter={number.compact} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.sql')}>
          <MetricValue snapshotId={snapshot.get('id')} metric="db.sql.count" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.sessions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['db.session.count', 'db.session.active.count'],
              labels: [
                t('in-forge:plugins.oTelDatabase.dashboard.total'),
                t('in-forge:plugins.oTelDatabase.dashboard.active')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.transactionsPerSecond')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['db.transaction.rate'],
              labels: [t('in-forge:plugins.oTelDatabase.dashboard.tps')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.ioPerSecond')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: ['db.io.read.rate', 'db.io.write.rate'],
              labels: [
                t('in-forge:plugins.oTelDatabase.dashboard.read'),
                t('in-forge:plugins.oTelDatabase.dashboard.write')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.transactionLatency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: seconds.detailed,
              metrics: ['db.transaction.latency'],
              labels: [t('in-forge:plugins.oTelDatabase.dashboard.averageLatency')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.sqlPerSecond')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['db.sql.rate'],
              labels: [t('in-forge:plugins.oTelDatabase.dashboard.qps')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.sqlLatency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: seconds.detailed,
              metrics: ['db.sql.latency'],
              labels: [t('in-forge:plugins.oTelDatabase.dashboard.sqlAverageLatency')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <CustomMetricsV2
        snapshot={snapshot}
        timeConfig={timeConfig}
        titlePrefix={t('in-forge:plugins.oTelDatabase.oTelDatabase')}
        specs={SPECS}
      />
    </div>
  );
}

export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];
