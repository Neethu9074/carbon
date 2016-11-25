import React from 'react';

import {bytesTwoDecimalPlaces, percentageZeroDecimalPlaces} from 'in-services/formatters/number';
import PercentageIndicator from 'in-sdk/components/table/PercentageIndicator';
import DashboardLink from 'in-components/Link/DashboardLink';
import {getMetricForFocusedMoment} from 'in-stores/metric';
import MetricValue from 'in-components/MetricValue';
import {time} from 'in-services/formatters/number';
import {getLabel} from 'in-sdk/snapshot';

export default [
  {
    title: 'App',
    sortableType: String,
    get(snapshot) {
      const label = getLabel(snapshot);

      return {
        content: (
          <DashboardLink snapshotId={snapshot.get('id')}>
            {label}
          </DashboardLink>
        ),
        sortable: label
      };
    }
  }, {
    title: 'Heap Used',
    sortableType: Number,
    style: {
      textAlign: 'right'
    },
    get(snapshot) {
      return {
        content: (
          <MetricValue snapshotId={snapshot.get('id')}
                       metric='memory.heapUsed'
                       formatter={bytesTwoDecimalPlaces} />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'memory.heapUsed'
        }).map(v => v[1])
      };
    }
  }, {
    title: 'GC Pause/s',
    sortableType: Number,
    style: {
      textAlign: 'right'
    },
    get(snapshot) {
      const gcStatsSupported = snapshot.getIn(['data', 'gc.statsSupported']);
      if (!gcStatsSupported) {
        return {
          content: 'Unsupported',
          sortable: -1
        };
      }

      const valueStream = getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'gc.gcPause'
        })
        .map(v => v[1] == null ? null : (1 / 1000 * v[1]));

      return {
        content: (
          <PercentageIndicator snapshotId={snapshot.get('id')}
                               createMetricValueStream={() => valueStream}
                               formatter={percentageZeroDecimalPlaces} />
        ),
        sortable$: valueStream
      };
    }
  }, {
    title: 'Event Loop Lag',
    sortableType: Number,
    style: {
      textAlign: 'right'
    },
    get(snapshot) {
      return {
        content: (
          <MetricValue snapshotId={snapshot.get('id')}
                       metric='libuv.lag'
                       formatter={time} />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'libuv.lag'
        }).map(v => v[1])
      };
    }
  }
];
