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
        <DashboardSection title="CPU">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: [broker + 'cpu_utilization'],
              labels: ['Utilization'],
              type: 'line',
              formatter: percentage.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        {instanceType === 'mq.t2.micro' && (
          <DashboardSection title="CPU Credit">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [broker + 'cpu_credit_balance'],
                labels: ['CpuCreditBalance'],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>

      <Columize>
        <DashboardSection title="Store Percent Usage">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: [broker + 'store_percent_usage'],
              labels: ['Usage'],
              type: 'line',
              formatter: percentage.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Heap Usage">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: [broker + 'heap_usage'],
              labels: ['Usage'],
              type: 'line',
              formatter: percentage.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Messages">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [broker + 'total_message_count'],
              labels: ['Count'],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Open Transactions">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [broker + 'open_transactions_count'],
              labels: ['Count'],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Network">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [broker + 'network_in', broker + 'network_out'],
            labels: ['In', 'Out'],
            type: 'line',
            formatter: bytes.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Connections, Consumers and Producers Count">
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
            labels: ['Connections', 'Producers', 'Consumers'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Journal Files For Recovery">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [broker + 'journal_files_for_fast_recovery', broker + 'journal_files_for_full_recovery'],
            labels: ['Fast', 'Full'],
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
