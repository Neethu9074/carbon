import React from 'react';

import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

export default function CrossRegionStats({ from, to, fromNodes, toNodes }) {
  return (
    <div>
      <h1>Cross region {`${from} => ${to}`}</h1>

      <p>
        These are read/write statistics from Kafka topic <strong>{to}_eum_spans</strong> located within{' '}
        <strong>{from}</strong> cluster.
      </p>

      <Columize>
        {toNodes.length > 0 ? (
          <DashboardTile title={`Reads from topic`}>
            <Chart
              snapshotIds={toNodes.map(n => n.dropwizardSnapshotId)}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: toNodes.map(
                  () =>
                    `metrics.meters.com.instana.backend.common.kafka.GenericKafkaConsumerRunnable.retrieved-messages.${
                      to
                    }_eum_spans.${from}`
                ),
                labels: toNodes.map(n => n.hostLabel),
                type: 'stackedArea'
              }}
            />
          </DashboardTile>
        ) : (
          <LoadingIndicator />
        )}

        {fromNodes.length > 0 ? (
          <DashboardTile title={`Writes to topic`}>
            <Chart
              snapshotIds={fromNodes.map(n => n.dropwizardSnapshotId)}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: fromNodes.map(() => `metrics.meters.kafka.writes.by_topic.${to}_eum_spans`),
                labels: fromNodes.map(n => n.hostLabel),
                type: 'stackedArea'
              }}
            />
          </DashboardTile>
        ) : (
          <LoadingIndicator />
        )}
      </Columize>
    </div>
  );
}
