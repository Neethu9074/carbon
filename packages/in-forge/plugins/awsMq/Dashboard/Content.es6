import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, number, percentage } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Chart from 'in-components/Chart';

import QueuesTable from './QueuesTable';
import TopicsTable from './TopicsTable';

export default function AwsMqDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const instanceType = snapshot.getIn(['data', 'instance_type']);

  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />

      <Columize>
        <DashboardSection title="CPU">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: ['cpu_utilization'],
              labels: ['Utilization'],
              type: 'line',
              formatter: percentage.detailed
            }}
          />
        </DashboardSection>
        {instanceType === 'mq.t2.micro' && (
          <DashboardSection title="CPU Credit">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['cpu_credit_balance'],
                labels: ['CpuCreditBalance'],
                type: 'line',
                formatter: number.compact
              }}
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
              metrics: ['store_percent_usage'],
              labels: ['Usage'],
              type: 'line',
              formatter: percentage.detailed
            }}
          />
        </DashboardSection>
        <DashboardSection title="Heap Usage">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: ['heap_usage'],
              labels: ['Usage'],
              type: 'line',
              formatter: percentage.detailed
            }}
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
              metrics: ['total_message_count'],
              labels: ['Count'],
              type: 'line',
              formatter: number.detailed
            }}
          />
        </DashboardSection>
        <DashboardSection title="Open Transactions">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['open_transactions_count'],
              labels: ['Count'],
              type: 'line',
              formatter: number.detailed
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Network">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['network_in', 'network_out'],
            labels: ['In', 'Out'],
            type: 'line',
            formatter: bytes.detailed
          }}
        />
      </DashboardSection>

      <DashboardSection title="Connections, Consumers and Producers Count">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['current_connections_count', 'total_producer_count', 'total_consumer_count'],
            labels: ['Connections', 'Producers', 'Consumers'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Journal Files For Recovery">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['journal_files_for_fast_recovery', 'journal_files_for_full_recovery'],
            labels: ['Fast', 'Full'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>

      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} />
      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
