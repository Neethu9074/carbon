import React from 'react';

import {percentageTwoDecimalPlaces, msTwoDecimalPlaces, zeroDecimalPlaces} from 'in-services/formatters/number';
import PercentageIndicator from 'in-sdk/components/table/PercentageIndicator';
import ImageAndLabel from 'in-sdk/components/table/ImageAndLabel';
import HierachialLink from 'in-components/Link/HierachialLink';
import {getMetricForFocusedMoment} from 'in-stores/metric';
import MetricValue from 'in-components/MetricValue';
import {getSingular} from 'in-sdk/pluginName';
import {getLabel} from 'in-sdk/snapshot';

export default [
  {
    title: 'Type',
    sortableType: String,
    get(snapshot) {
      const pluginName = getSingular(snapshot.get('plugin'));
      return {
        sortable: pluginName,
        content: (
          <ImageAndLabel snapshot={snapshot}>
            {pluginName}
          </ImageAndLabel>
        )
      };
    }
  },
  {
    title: 'Name',
    sortableType: String,
    get(snapshot) {
      const name = getLabel(snapshot);
      return {
        content: (
          <HierachialLink snapshotId={snapshot.get('id')}>
            {name}
          </HierachialLink>
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
                       formatter={zeroDecimalPlaces} />
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
                       formatter={msTwoDecimalPlaces} />
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
                               formatter={percentageTwoDecimalPlaces} />
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
                       formatter={zeroDecimalPlaces} />
        ),
        sortable$: valueStream
      };
    }
  }
];
