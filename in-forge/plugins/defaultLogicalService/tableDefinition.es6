import React from 'react';

import {percentageTwoDecimalPlaces, msTwoDecimalPlaces, zeroDecimalPlaces} from 'in-services/formatters/number';
import PercentageIndicator from 'in-sdk/components/table/PercentageIndicator';
import ImageAndLabel from 'in-sdk/components/table/ImageAndLabel';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
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
          <HierarchicalLink snapshotId={snapshot.get('id')}
                            kind='dark'>
            {name}
          </HierarchicalLink>
        ),
        sortable: name
      };
    }
  },
  {
    title: 'Calls',
    sortableType: String,
    style: {
      textAlign: 'right',
      maxWidth: '7.5rem'
    },
    get(snapshot) {
      return {
        content: (
          <MetricValue snapshotId={snapshot.get('id')}
                       metric='count'
                       formatter={zeroDecimalPlaces}
                       optionalTimeWindowAggregation='adjustedCount' />
        ),
        sortable$: getMetricForFocusedMoment({
            snapshotId: snapshot.get('id'),
            metric: 'count'
          })
          .map(v => v[1])
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
      return {
        content: (
          <MetricValue snapshotId={snapshot.get('id')}
                       metric='duration.mean'
                       formatter={msTwoDecimalPlaces}
                       optionalTimeWindowAggregation='mean' />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'duration.mean'
        })
        .map(v => v[1])
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
      return {
        content: (
          <PercentageIndicator snapshotId={snapshot.get('id')}
                               metric='error_rate'
                               formatter={percentageTwoDecimalPlaces}
                               optionalTimeWindowAggregation='mean' />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'error_rate'
        })
        .map(v => v[1])
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
      return {
        content: (
          <MetricValue snapshotId={snapshot.get('id')}
                       metric='instances'
                       formatter={zeroDecimalPlaces}
                       optionalTimeWindowAggregation='mean' />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'instances'
        })
        .map(v => v[1])
      };
    }
  }
];
