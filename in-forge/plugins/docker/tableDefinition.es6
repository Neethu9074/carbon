import React from 'react';

import {bytesTwoDecimalPlaces, percentageZeroDecimalPlaces} from 'in-services/formatters/number';
import PercentageIndicator from 'in-sdk/components/table/PercentageIndicator';
import HierachialLink from 'in-components/Link/HierachialLink';
import {getMetricForFocusedMoment} from 'in-stores/metric';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';

export default [
  {
    title: 'Name',
    sortableType: String,
    get(snapshot) {
      const label = getLabel(snapshot);

      return {
        content: (
          <HierachialLink snapshotId={snapshot.get('id')}>
            {label}
          </HierachialLink>
        ),
        sortable: label
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
      const valueStream = getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'cpu.total_usage'
        })
        .map(v => v[1]);

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
                       formatter={bytesTwoDecimalPlaces} />
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
