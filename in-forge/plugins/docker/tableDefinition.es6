import React from 'react';

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import PercentageIndicator from 'in-sdk/components/table/PercentageIndicator';
import getHostSnapshotId from 'in-services/subscription/getHostSnapshotId';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { getMetricForFocusedMoment } from 'in-stores/metric';
import MetricValue from 'in-components/MetricValue';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';

export default [
  {
    title: 'Host',
    sortableType: String,
    get(snapshot) {
      return getHostSnapshotId(snapshot).flatMap(hostSnapshotId => {
        return getSnapshot(hostSnapshotId).map(host => {
          const label = getLabel(host);
          return {
            content: (
              <HierarchicalLink snapshotId={host.get('id')} kind="dark">
                {label}
              </HierarchicalLink>
            ),
            sortable: label
          };
        });
      });
    }
  },
  {
    title: 'Name',
    sortableType: String,
    get(snapshot) {
      const label = getLabel(snapshot);

      return {
        content: (
          <HierarchicalLink snapshotId={snapshot.get('id')} kind="dark">
            {label}
          </HierarchicalLink>
        ),
        sortable: label
      };
    }
  },
  {
    title: 'CPU Usage',
    style: {
      textAlign: 'right',
      maxWidth: '9rem'
    },
    sortableType: Number,
    defaultSortDirection: 'desc',
    get(snapshot) {
      return {
        content: (
          <PercentageIndicator
            snapshotId={snapshot.get('id')}
            metric="cpu.total_usage"
            formatter={percentageZeroDecimalPlaces}
            optionalTimeWindowAggregation="mean"
          />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'cpu.total_usage'
        }).map(v => v[1])
      };
    }
  },
  {
    title: 'Memory Usage',
    style: {
      textAlign: 'right',
      maxWidth: '9rem'
    },
    sortableType: Number,
    defaultSortDirection: 'desc',
    get(snapshot) {
      return {
        content: (
          <MetricValue
            snapshotId={snapshot.get('id')}
            metric="memory.usage"
            formatter={bytesTwoDecimalPlaces}
            optionalTimeWindowAggregation="mean"
          />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'memory.usage'
        }).map(v => v[1])
      };
    }
  },
  {
    title: 'Network received',
    style: {
      textAlign: 'right',
      maxWidth: '9rem'
    },
    sortableType: Number,
    defaultSortDirection: 'desc',
    get(snapshot) {
      return {
        content: (
          <MetricValue
            snapshotId={snapshot.get('id')}
            metric="network.rx.bytes"
            formatter={bytesTwoDecimalPlaces}
            optionalTimeWindowAggregation="mean"
          />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'network.rx.bytes'
        }).map(v => v[1])
      };
    }
  },
  {
    title: 'Network transmitted',
    style: {
      textAlign: 'right',
      maxWidth: '10rem'
    },
    sortableType: Number,
    defaultSortDirection: 'desc',
    get(snapshot) {
      return {
        content: (
          <MetricValue
            snapshotId={snapshot.get('id')}
            metric="network.tx.bytes"
            formatter={bytesTwoDecimalPlaces}
            optionalTimeWindowAggregation="mean"
          />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'network.tx.bytes'
        }).map(v => v[1])
      };
    }
  }
];
