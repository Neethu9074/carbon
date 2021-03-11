/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { number, bytes, millis, percentage } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
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
        <KpiKeyValue label={t('in-forge:plugins.awsMskBroker.dashboard.partitions')}>
          <MetricValue snapshotId={snapshotId} metric="partition_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsMskBroker.dashboard.underReplicatedPartitionCount')}>
          <MetricValue snapshotId={snapshotId} metric="under_replicated_partitions" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.awsMskBroker.dashboard.partitions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['partition_count'],
            labels: [t('in-forge:plugins.awsMskBroker.dashboard.count')],
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

      <DashboardSection title={t('in-forge:plugins.awsMskBroker.dashboard.leaders')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['leader_count'],
            labels: [t('in-forge:plugins.awsMskBroker.dashboard.count')],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsMskBroker.dashboard.brokerTraffic')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['bytes_in_ser_sec', 'bytes_out_per_sec'],
              labels: [
                t('in-forge:plugins.awsMskBroker.dashboard.in'),
                t('in-forge:plugins.awsMskBroker.dashboard.out')
              ],
              formatter: bytes.perSecond.compact,
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.awsMskBroker.dashboard.request')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['request_bytes_mean'],
              labels: [t('in-forge:plugins.awsMskBroker.dashboard.bytes')],
              formatter: bytes.compact,
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.awsMskBroker.dashboard.brokerMessageIn')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['messages_in_per_sec'],
              labels: [t('in-forge:plugins.awsMskBroker.dashboard.count')],
              formatter: number.perSecond,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.awsMskBroker.dashboard.cpu')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            metrics: ['cpu_user', 'cpu_system', 'cpu_idle'],
            labels: [
              t('in-forge:plugins.awsMskBroker.dashboard.user'),
              t('in-forge:plugins.awsMskBroker.dashboard.system'),
              t('in-forge:plugins.awsMskBroker.dashboard.idle')
            ],
            formatter: percentage.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsMskBroker.memory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['memory_free', 'memory_used', 'memory_cached', 'memory_buffered', 'swap_free', 'swap_used'],
            labels: [
              t('in-forge:plugins.awsMskBroker.free'),
              t('in-forge:plugins.awsMskBroker.used'),
              t('in-forge:plugins.awsMskBroker.cached'),
              t('in-forge:plugins.awsMskBroker.buffered'),
              t('in-forge:plugins.awsMskBroker.swapFree'),
              t('in-forge:plugins.awsMskBroker.swapUsed')
            ],
            formatter: bytes.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsMskBroker.networkReceive')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['network_rx_packets', 'network_rx_dropped'],
              labels: [t('in-forge:plugins.awsMskBroker.received'), t('in-forge:plugins.awsMskBroker.dropped')],
              formatter: number.compact,
              type: 'line'
            }}
            y2={{
              min: 0,
              metrics: ['network_rx_errors'],
              labels: [t('in-forge:plugins.awsMskBroker.errors')],
              formatter: number.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsMskBroker.networkTransmit')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['network_tx_packets', 'network_tx_dropped'],
              labels: [t('in-forge:plugins.awsMskBroker.transmitted'), t('in-forge:plugins.awsMskBroker.dropped')],
              formatter: number.compact,
              type: 'line'
            }}
            y2={{
              min: 0,
              metrics: ['network_tx_errors'],
              labels: [t('in-forge:plugins.awsMskBroker.errors')],
              formatter: number.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      {clusterEnhancedMonitoring !== 'DEFAULT' && (
        <DashboardSection title={t('in-forge:plugins.awsMskBroker.dashboard.produceTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['produce_total_time'],
              labels: [t('in-forge:plugins.awsMskBroker.dashboard.mean')],
              formatter: millis,
              type: 'line'
            }}
          />
        </DashboardSection>
      )}
      {clusterEnhancedMonitoring !== 'DEFAULT' && (
        <DashboardSection title={t('in-forge:plugins.awsMskBroker.dashboard.throttleTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['produce_throttle_time', 'fetch_throttle_time', 'request_throttle_time'],
              labels: [
                t('in-forge:plugins.awsMskBroker.dashboard.produce'),
                t('in-forge:plugins.awsMskBroker.dashboard.fetch'),
                t('in-forge:plugins.awsMskBroker.dashboard.request')
              ],
              formatter: millis,
              type: 'line'
            }}
          />
        </DashboardSection>
      )}
      {clusterEnhancedMonitoring !== 'DEFAULT' && (
        <DashboardSection title={t('in-forge:plugins.awsMskBroker.throttleByteRate')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['produce_throttle_byte_rate', 'fetch_throttle_byte_rate'],
              labels: [
                t('in-forge:plugins.awsMskBroker.dashboard.produce'),
                t('in-forge:plugins.awsMskBroker.dashboard.fetch')
              ],
              formatter: bytes.perSecond.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      )}
      {clusterEnhancedMonitoring !== 'DEFAULT' && (
        <DashboardSection title={t('in-forge:plugins.awsMskBroker.dashboard.fetchTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['fetch_consumer_total_time', 'fetch_follower_total_time'],
              labels: [
                t('in-forge:plugins.awsMskBroker.dashboard.consumer'),
                t('in-forge:plugins.awsMskBroker.dashboard.follower')
              ],
              formatter: millis,
              type: 'line'
            }}
          />
        </DashboardSection>
      )}
      {clusterEnhancedMonitoring !== 'DEFAULT' && (
        <DashboardSection title={t('in-forge:plugins.awsMskBroker.dashboard.idleTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: ['network_processor_idle', 'request_handler_idle'],
              labels: [
                t('in-forge:plugins.awsMskBroker.dashboard.network'),
                t('in-forge:plugins.awsMskBroker.dashboard.request')
              ],
              formatter: percentage.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      )}
    </div>
  );
}
