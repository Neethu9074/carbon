import {memoize} from 'lodash';
import React from 'react';

import {siPrefixPerSecond} from 'in-services/formatters/number';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import {getMetricForFocusedMoment} from 'in-stores/metric';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';

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
    sortableType: String,
    get(snapshot) {
      const label = getLabel(snapshot);

      return {
        content: (
          <HierarchicalLink snapshotId={snapshot.get('id')}
                            kind='dark'>
            {label}
          </HierarchicalLink>
        ),
        sortable: label
      };
    }
  }, {
    title: 'Environment',
    sortableType: String,
    get(snapshot) {
      return getTenantUnitCoordinates(snapshot).environment;
    }
  }, {
    title: 'Tenant',
    sortableType: String,
    get(snapshot) {
      return getTenantUnitCoordinates(snapshot).tenant;
    }
  }, {
    title: 'Unit',
    sortableType: String,
    get(snapshot) {
      return getTenantUnitCoordinates(snapshot).unit;
    }
  }, {
    title: 'Accepted Spans',
    sortableType: Number,
    defaultSortDirection: 'desc',
    style: {
      textAlign: 'right',
      maxWidth: '9rem'
    },
    get: getMeterCellContent.bind(
      null,
      'metrics.meters.com.instana.filler.topology.spans.SpansStreamInitializer.accepted-from-kafka-spans'
    )
  }, {
    title: 'Dropped Spans',
    sortableType: Number,
    defaultSortDirection: 'desc',
    style: {
      textAlign: 'right',
      maxWidth: '9rem'
    },
    get: getMeterCellContent.bind(
      null,
      'metrics.meters.com.instana.filler.spanbuffer.ScheduledSpanBatcher.dropped-spans'
    )
  }, {
    title: 'Dropped Messages',
    sortableType: Number,
    defaultSortDirection: 'desc',
    style: {
      textAlign: 'right',
      maxWidth: '9rem'
    },
    get: getMeterCellContent.bind(
      null,
      'metrics.meters.com.instana.filler.topology.RawMessagesStreamInitializer.dropped-messages'
    )
  }, {
    title: 'Raw Messages',
    sortableType: Number,
    defaultSortDirection: 'desc',
    style: {
      textAlign: 'right',
      maxWidth: '9rem'
    },
    get(snapshot) {
      const coords = getTenantUnitCoordinates(snapshot);
      const metric = 'metrics.meters.com.instana.backend.common.mom.consumer.GenericKafkaConsumerRunnable.' +
        `retrieved-messages.${coords.environment}_${coords.tenant}_${coords.unit}_raw_messages`;
      return getMeterCellContent(metric, snapshot);
    }
  }, {
    title: 'Combined Metrics',
    sortableType: Number,
    defaultSortDirection: 'desc',
    style: {
      textAlign: 'right',
      maxWidth: '9rem'
    },
    get(snapshot) {
      const coords = getTenantUnitCoordinates(snapshot);
      const metric = 'metrics.meters.com.instana.filler.topology.downstream.FilledMetricsKafkaDownstream.' +
        `produced-kafka-messages.${coords.environment}_${coords.tenant}_${coords.unit}_combined_metrics`;
      return getMeterCellContent(metric, snapshot);
    }
  }, {
    title: 'Rollups',
    sortableType: Number,
    defaultSortDirection: 'desc',
    style: {
      textAlign: 'right',
      maxWidth: '9rem'
    },
    get(snapshot) {
      const coords = getTenantUnitCoordinates(snapshot);
      const metric = 'metrics.meters.com.instana.filler.topology.downstream.RollupsKafkaDownstream.' +
        `produced-kafka-messages.${coords.environment}_${coords.tenant}_${coords.unit}_rollups`;
      return getMeterCellContent(metric, snapshot);
    }
  }, {
    title: 'Snapshots',
    sortableType: Number,
    defaultSortDirection: 'desc',
    style: {
      textAlign: 'right',
      maxWidth: '9rem'
    },
    get(snapshot) {
      const coords = getTenantUnitCoordinates(snapshot);
      const metric = 'metrics.meters.com.instana.filler.topology.downstream.SnapshotsKafkaDownstream.' +
        `produced-kafka-messages.${coords.environment}_${coords.tenant}_${coords.unit}_snapshots`;
      return getMeterCellContent(metric, snapshot);
    }
  }
];


function getMeterCellContent(metric, snapshot) {
  return {
    content: (
      <MetricValue snapshotId={snapshot.get('id')}
                   metric={metric}
                   formatter={siPrefixPerSecond.detailed}
                   optionalTimeWindowAggregation='mean' />
    ),
    sortable$: getMetricForFocusedMoment({
      snapshotId: snapshot.get('id'),
      metric
    }).map(v => v[1])
  };
}
