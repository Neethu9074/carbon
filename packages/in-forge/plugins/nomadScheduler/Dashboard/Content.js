/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { number, withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import GaugesTable from './GaugesTable';
import { t } from 'in-i18n';

export default function NomadDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const errorCode = snapshot.getIn(['data', 'error_code']);

  if (errorCode !== 'NO_ERROR') {
    return (
      <DashboardNotification type="warning">
        <strong>{t('in-forge:plugins.nomadScheduler.nomadMetricsAreNotAvailable')}</strong>
        <p>{t('in-forge:plugins.nomadScheduler.pleaseCheckIfTheNomadMetricsEndpointIsReachable')}</p>
      </DashboardNotification>
    );
  } else {
    return (
      <div>
        <KpiSection>
          <KpiKeyValue label={t('in-forge:plugins.nomadScheduler.running')}>
            <MetricValue snapshotId={snapshotId} metric="nomad.client.allocations.running" formatter={number.compact} />
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.nomadScheduler.migrating')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="nomad.client.allocations.migrating"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.nomadScheduler.pending')}>
            <MetricValue snapshotId={snapshotId} metric="nomad.client.allocations.pending" formatter={number.compact} />
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.nomadScheduler.terminal')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="nomad.client.allocations.terminal"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.nomadScheduler.blocked')}>
            <MetricValue snapshotId={snapshotId} metric="nomad.client.allocations.blocked" formatter={number.compact} />
          </KpiKeyValue>
        </KpiSection>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.nomadScheduler.cpuMHz')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['nomad.client.allocated.cpu', 'nomad.client.unallocated.cpu'],
                labels: [
                  t('in-forge:plugins.nomadScheduler.allocatedCpu'),
                  t('in-forge:plugins.nomadScheduler.unallocatedCpu')
                ],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title={t('in-forge:plugins.nomadScheduler.memory')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['nomad.client.allocated.memory', 'nomad.client.unallocated.memory'],
                labels: [
                  t('in-forge:plugins.nomadScheduler.allocatedMemory'),
                  t('in-forge:plugins.nomadScheduler.unallocatedMemory')
                ],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.nomadScheduler.disk')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['nomad.client.allocated.disk', 'nomad.client.unallocated.disk'],
                labels: [
                  t('in-forge:plugins.nomadScheduler.allocatedDisk'),
                  t('in-forge:plugins.nomadScheduler.unallocatedDisk')
                ],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title={t('in-forge:plugins.nomadScheduler.iops')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['nomad.client.allocated.iops', 'nomad.client.unallocated.iops'],
                labels: [
                  t('in-forge:plugins.nomadScheduler.allocatedIops'),
                  t('in-forge:plugins.nomadScheduler.unallocatedIops')
                ],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <DashboardSection title={t('in-forge:plugins.nomadScheduler.allocations')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'nomad.client.allocations.running',
                'nomad.client.allocations.migrating',
                'nomad.client.allocations.pending',
                'nomad.client.allocations.terminal',
                'nomad.client.allocations.blocked'
              ],
              labels: [
                t('in-forge:plugins.nomadScheduler.running'),
                t('in-forge:plugins.nomadScheduler.migrating'),
                t('in-forge:plugins.nomadScheduler.pending'),
                t('in-forge:plugins.nomadScheduler.terminal'),
                t('in-forge:plugins.nomadScheduler.blocked')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.nomadScheduler.brokerCore')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['nomad.nomad.broker._core.unacked', 'nomad.nomad.broker._core.ready'],
                labels: [
                  t('in-forge:plugins.nomadScheduler.unacknowledged'),
                  t('in-forge:plugins.nomadScheduler.ready')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title={t('in-forge:plugins.nomadScheduler.broker')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  'nomad.nomad.broker.total_unacked',
                  'nomad.nomad.broker.total_waiting',
                  'nomad.nomad.broker.total_ready',
                  'nomad.nomad.broker.total_blocked'
                ],
                labels: [
                  t('in-forge:plugins.nomadScheduler.unacknowledged'),
                  t('in-forge:plugins.nomadScheduler.waiting'),
                  t('in-forge:plugins.nomadScheduler.ready'),
                  t('in-forge:plugins.nomadScheduler.blocked')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <DashboardSection title={t('in-forge:plugins.nomadScheduler.totalBlockedEvaluations')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'nomad.nomad.blocked_evals.total_quota_limit',
                'nomad.nomad.blocked_evals.total_blocked',
                'nomad.nomad.blocked_evals.total_escaped'
              ],
              labels: [
                t('in-forge:plugins.nomadScheduler.quotaLimit'),
                t('in-forge:plugins.nomadScheduler.blocked'),
                t('in-forge:plugins.nomadScheduler.escaped')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <Columize>
          <GaugesTable snapshot={snapshot} timeConfig={timeConfig} />
        </Columize>
      </div>
    );
  }
}
