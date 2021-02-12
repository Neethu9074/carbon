/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number, bytes, millis, percentage } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function AwsMskBrokerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const clusterEnhancedMonitoring = snapshot.getIn(['data', 'clusterEnhancedMonitoring']);

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Partitions">
          <MetricValue snapshotId={snapshotId} metric="partition_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Under-replicated Partition Count">
          <MetricValue snapshotId={snapshotId} metric="under_replicated_partitions" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Partitions">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['partition_count'],
            labels: ['Count'],
            formatter: number.compact,
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['under_replicated_partitions'],
            labels: ['Under-replicated'],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Leaders">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['leader_count'],
            labels: ['Count'],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title="Broker Traffic">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['bytes_in_ser_sec', 'bytes_out_per_sec'],
              labels: ['In', 'Out'],
              formatter: bytes.compact,
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Request">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['request_bytes_mean'],
              labels: ['Bytes'],
              formatter: bytes.compact,
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Broker Message In">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['messages_in_per_sec'],
              labels: ['Count'],
              formatter: number.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="CPU">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            metrics: ['cpu_user', 'cpu_system', 'cpu_idle'],
            labels: ['User', 'System', 'Idle'],
            formatter: percentage.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      {clusterEnhancedMonitoring !== 'DEFAULT' && (
        <DashboardSection title="Produce Time">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['produce_total_time'],
              labels: ['Mean'],
              formatter: millis.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      )}
      {clusterEnhancedMonitoring !== 'DEFAULT' && (
        <DashboardSection title="Throttle Time">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['produce_throttle_time', 'fetch_throttle_time', 'request_throttle_time'],
              labels: ['Produce', 'Fetch', 'Request'],
              formatter: millis.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      )}
      {clusterEnhancedMonitoring !== 'DEFAULT' && (
        <DashboardSection title="Fetch Time">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['fetch_consumer_total_time', 'fetch_follower_total_time'],
              labels: ['Consumer', 'Follower'],
              formatter: millis.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      )}
      {clusterEnhancedMonitoring !== 'DEFAULT' && (
        <DashboardSection title="Idle Time">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: ['network_processor_idle', 'request_handler_idle'],
              labels: ['Network', 'Request'],
              formatter: percentage.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      )}
    </div>
  );
}
