/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiHeading } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, number, percentage } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { getLabel } from 'in-sdk/snapshot';
import QueuesTable from './QueuesTable';
import TopicsTable from './TopicsTable';
import { t } from 'in-i18n';

export default function AwsMqBrokerDashboard({ snapshot, timeConfig, type }) {
  const snapshotId = snapshot.get('id');
  const instanceType = snapshot.getIn(['data', 'instance_type']);
  const broker = type === '' ? '' : 'broker' + type + '.';

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot) + ' ' + type}</KpiHeading>
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.cpu')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: [broker + 'cpu_utilization'],
              labels: [t('in-forge:plugins.awsMq.dashboard.utilization')],
              type: 'line',
              formatter: percentage.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        {instanceType === 'mq.t2.micro' && (
          <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.cpuCredit')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [broker + 'cpu_credit_balance'],
                labels: [t('in-forge:plugins.awsMq.dashboard.cpuCreditBalance')],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.storePercentUsage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: [broker + 'store_percent_usage'],
              labels: [t('in-forge:plugins.awsMq.dashboard.usage')],
              type: 'line',
              formatter: percentage.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.heapUsage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: [broker + 'heap_usage'],
              labels: [t('in-forge:plugins.awsMq.dashboard.usage')],
              type: 'line',
              formatter: percentage.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.messages')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [broker + 'total_message_count'],
              labels: [t('in-forge:plugins.awsMq.dashboard.count')],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.openTransactions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [broker + 'open_transactions_count'],
              labels: [t('in-forge:plugins.awsMq.dashboard.count')],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.network')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [broker + 'network_in', broker + 'network_out'],
            labels: [t('in-forge:plugins.awsMq.dashboard.in'), t('in-forge:plugins.awsMq.dashboard.out')],
            type: 'line',
            formatter: bytes.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.connectionsConsumersAndProducersCount')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              broker + 'current_connections_count',
              broker + 'total_producer_count',
              broker + 'total_consumer_count'
            ],
            labels: [
              t('in-forge:plugins.awsMq.dashboard.connections'),
              t('in-forge:plugins.awsMq.dashboard.producers'),
              t('in-forge:plugins.awsMq.dashboard.consumers')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.journalFilesForRecovery')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [broker + 'journal_files_for_fast_recovery', broker + 'journal_files_for_full_recovery'],
            labels: [t('in-forge:plugins.awsMq.dashboard.fast'), t('in-forge:plugins.awsMq.dashboard.full')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} type={type} />
      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} type={type} />
    </div>
  );
}
