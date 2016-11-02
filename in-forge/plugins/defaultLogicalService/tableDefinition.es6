import React from 'react';

import {percentageTwoDecimalPlaces, msTwoDecimalPlaces, zeroDecimalPlaces} from 'in-services/formatters/number';
import PercentageIndicator from 'in-sdk/components/table/PercentageIndicator';
import DashboardLink from 'in-components/Link/DashboardLink';
import {getMetricForFocusedMoment} from 'in-stores/metric';
import MetricValue from 'in-components/MetricValue';
import {getSingular} from 'in-sdk/pluginName';

export default [
  {
    title: 'Type',
    sortableType: String,
    get(snapshot) {
      return getSingular(snapshot.get('plugin'));
    }
  },
  {
    title: 'Name',
    sortableType: String,
    get(snapshot) {
      const name = snapshot.getIn(['data', 'service_name']);
      return {
        content: (
          <DashboardLink snapshotId={snapshot.get('id')}>
            {name}
          </DashboardLink>
        ),
        sortable: name
      };
    }
  },
  {
    title: 'Calls/s',
    sortableType: String,
    style: {
      textAlign: 'right',
      maxWidth: '7.5rem'
    },
    get(snapshot) {
      const valueStream = getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'count'
        })
        .map(v => v[1]);

      return {
        content: (
          <MetricValue snapshotId={snapshot.get('id')}
                       createMetricValueStream={() => valueStream}
                       formatter={zeroDecimalPlaces}/>
        ),
        sortable$: valueStream
      };
    }
  },
  {
    title: 'Avg. Latency',
    sortableType: String,
    style: {
      textAlign: 'right',
      maxWidth: '7.5rem'
    },
    get(snapshot) {
      const valueStream = getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'duration.mean'
        })
        .map(v => v[1]);

      return {
        content: (
          <MetricValue snapshotId={snapshot.get('id')}
                       createMetricValueStream={() => valueStream}
                       formatter={msTwoDecimalPlaces}/>
        ),
        sortable$: valueStream
      };
    }
  },
  {
    title: 'Error Rate',
    sortableType: String,
    style: {
      textAlign: 'right',
      maxWidth: '7.5rem'
    },
    get(snapshot) {
      const valueStream = getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'error_rate'
        })
        .map(v => v[1]);

      return {
        content: (
          <PercentageIndicator snapshotId={snapshot.get('id')}
                               createMetricValueStream={() => valueStream}
                               formatter={percentageTwoDecimalPlaces}/>
        ),
        sortable$: valueStream
      };
    }
  },
  {
    title: '#Instances',
    sortableType: String,
    style: {
      textAlign: 'right',
      maxWidth: '7.5rem'
    },
    get(snapshot) {
      const valueStream = getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'instances'
        })
        .map(v => v[1]);

      return {
        content: (
          <MetricValue snapshotId={snapshot.get('id')}
                       createMetricValueStream={() => valueStream}
                       formatter={zeroDecimalPlaces}/>
        ),
        sortable$: valueStream
      };
    }
  }
];
