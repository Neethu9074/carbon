import React from 'react';

import {bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
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
          <HierarchicalLink snapshotId={snapshot.get('id')}
                            kind='dark'>
            {label}
          </HierarchicalLink>
        ),
        sortable: label
      };
    }
  }, {
    title: 'Java Version',
    sortableType: String,
    get(snapshot) {
      return snapshot.getIn(['data', 'jvm.version']) + ' ' +
             snapshot.getIn(['data', 'jvm.build']);
    }
  }, {
    title: 'Java Runtime',
    sortableType: String,
    get(snapshot) {
      return snapshot.getIn(['data', 'jvm.vendor']) + ' ' +
             snapshot.getIn(['data', 'jvm.name']);
    }
  }, {
    title: 'Heap Used',
    sortableType: Number,
    style: {
      maxWidth: '6.25rem',
      textAlign: 'right'
    },
    defaultSortDirection: 'desc',
    get(snapshot) {
      return {
        content: (
          <MetricValue snapshotId={snapshot.get('id')}
                       metric='memory.used'
                       formatter={bytesTwoDecimalPlaces} />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'memory.used'
        })
        .map(v => v[1])
      };
    }
  }
];
