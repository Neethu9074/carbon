import { memoize } from 'lodash';

import { siPrefixPerSecond } from 'in-services/formatters/number';

const getTenantUnitCoordinates = memoize(
  function getTenantUnitCoordinates(snapshot) {
    const regex = /GenericKafkaConsumerRunnable\.retrieved-messages\.([a-z0-9]+)_([a-z0-9]+)_([a-z0-9]+)_.*$/i;
    const meters = snapshot.getIn(['data', 'metrics.meters']).toArray();
    for (let i = 0, len = meters.length; i < len; i++) {
      const meter = meters[i];
      const match = meter.match(regex);
      if (match) {
        return {
          tenant: match[2],
          unit: match[3],
          environment: match[1]
        };
      }
    }

    return {
      tenant: '',
      unit: '',
      environment: ''
    };
  },
  snapshot => snapshot.get('id')
);

export default [
  {
    title: 'App',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: 'Environment',
    type: 'string',
    typeArgs: {
      getContent(row) {
        return getTenantUnitCoordinates(row.snapshot).environment;
      }
    }
  },
  {
    title: 'Tenant',
    type: 'string',
    typeArgs: {
      getContent(row) {
        return getTenantUnitCoordinates(row.snapshot).tenant;
      }
    }
  },
  {
    title: 'Unit',
    type: 'string',
    typeArgs: {
      getContent(row) {
        return getTenantUnitCoordinates(row.snapshot).unit;
      }
    }
  },
  {
    title: 'Accepted Spans',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'metrics.meters.com.instana.filler.topology.spans.SpansStreamInitializer.accepted-from-kafka-spans';
      },
      getContent: siPrefixPerSecond.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Dropped Spans',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'metrics.meters.com.instana.filler.spanbuffer.ScheduledSpanBatcher.dropped-spans';
      },
      getContent: siPrefixPerSecond.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Raw Messages',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        const coords = getTenantUnitCoordinates(row.snapshot);
        return (
          'com.instana.backend.common.kafka.GenericKafkaConsumerRunnable.' +
          `retrieved-messages.${coords.environment}_${coords.tenant}_${coords.unit}_raw_messages`
        );
      },
      getContent: siPrefixPerSecond.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Dropped Messages',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'metrics.meters.com.instana.filler.topology.RawMessagesStreamInitializer.dropped-messages';
      },
      getContent: siPrefixPerSecond.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Combined Metrics',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        const coords = getTenantUnitCoordinates(row.snapshot);
        return (
          'metrics.meters.com.instana.filler.topology.downstream.FilledMetricsKafkaDownstream.' +
          `produced-kafka-messages.${coords.environment}_${coords.tenant}_${coords.unit}_combined_metrics`
        );
      },
      getContent: siPrefixPerSecond.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Rollups',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        const coords = getTenantUnitCoordinates(row.snapshot);
        return (
          'metrics.meters.com.instana.filler.topology.downstream.RollupsKafkaDownstream.' +
          `produced-kafka-messages.${coords.environment}_${coords.tenant}_${coords.unit}_rollups`
        );
      },
      getContent: siPrefixPerSecond.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Snapshots',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        const coords = getTenantUnitCoordinates(row.snapshot);
        return (
          'metrics.meters.com.instana.filler.topology.downstream.SnapshotsKafkaDownstream.' +
          `produced-kafka-messages.${coords.environment}_${coords.tenant}_${coords.unit}_snapshots`
        );
      },
      getContent: siPrefixPerSecond.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];
