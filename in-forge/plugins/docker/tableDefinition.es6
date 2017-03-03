import React from 'react';

import {bytesTwoDecimalPlaces, percentageZeroDecimalPlaces} from 'in-services/formatters/number';
import PercentageIndicator from 'in-sdk/components/table/PercentageIndicator';
import getHostSnapshotId from 'in-services/subscription/getHostSnapshotId';
import {formatDateTime, fromNow} from 'in-services/formatters/date';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import {getMetricForFocusedMoment} from 'in-stores/metric';
import MetricValue from 'in-components/MetricValue';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';

export default [
  {
    title: 'Host',
    sortableType: String,
    get(snapshot) {
      return getHostSnapshotId(snapshot)
        .flatMap(hostSnapshotId => {
          return getSnapshot(hostSnapshotId)
            .map(host => {
              const label = getLabel(host);
              return {
                content: (
                  <HierarchicalLink snapshotId={host.get('id')}
                                    kind='dark'>
                    {label}
                  </HierarchicalLink>
                ),
                sortable: label
              };
            });
        });
    }
  }, {
    title: 'Name',
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
    title: 'Created',
    sortableType: Number,
    get(snapshot) {
      const date = snapshot.get('data').get('Created');
      return {
        content: (
          <span>
            {formatDateTime(date)} ({fromNow(date)})
          </span>
        ),
        sortable: date
      };
    }
  }, {
    title: 'Started',
    sortableType: Number,
    get(snapshot) {
      const date = snapshot.get('data').get('Started');
      return {
        content: (
          <span>
            {formatDateTime(date)} ({fromNow(date)})
          </span>
        ),
        sortable: date
      };
    }
  }, {
    title: 'CPU Usage',
    style: {
      textAlign: 'right'
    },
    sortableType: Number,
    defaultSortDirection: 'desc',
    get(snapshot) {
      return {
        content: (
          <PercentageIndicator snapshotId={snapshot.get('id')}
                               metric='cpu.total_usage'
                               formatter={percentageZeroDecimalPlaces}
                               optionalTimeWindowAggregation='mean' />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'cpu.total_usage'
        })
        .map(v => v[1])
      };
    }
  }, {
    title: 'Memory Usage',
    style: {
      textAlign: 'right'
    },
    sortableType: Number,
    defaultSortDirection: 'desc',
    get(snapshot) {
      return {
        content: (
          <MetricValue snapshotId={snapshot.get('id')}
                       metric='memory.usage'
                       formatter={bytesTwoDecimalPlaces}
                       optionalTimeWindowAggregation='mean' />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'memory.usage'
        })
        .map(v => v[1])
      };
    }
  }
];
