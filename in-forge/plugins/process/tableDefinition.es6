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
          <HierarchicalLink snapshotId={snapshot.get('id')} kind="dark" calculateHierarchy>
            {label}
          </HierarchicalLink>
        ),
        sortable: label
      };
    }
  },
  {
    title: 'CPU User',
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
            metric="cpu.user"
            formatter={percentageZeroDecimalPlaces}
            optionalTimeWindowAggregation="mean"
          />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'cpu.user'
        }).map(v => v[1])
      };
    }
  },
  {
    title: 'CPU System',
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
            metric="cpu.sys"
            formatter={percentageZeroDecimalPlaces}
            optionalTimeWindowAggregation="mean"
          />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'cpu.sys'
        }).map(v => v[1])
      };
    }
  },
  {
    title: 'Virtual Memory',
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
            metric="mem.virtual"
            formatter={bytesTwoDecimalPlaces}
            optionalTimeWindowAggregation="mean"
          />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'mem.virtual'
        }).map(v => v[1])
      };
    }
  },
  {
    title: 'Resident Memory',
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
            metric="mem.resident"
            formatter={bytesTwoDecimalPlaces}
            optionalTimeWindowAggregation="mean"
          />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'mem.resident'
        }).map(v => v[1])
      };
    }
  },
  {
    title: 'Shared Memory',
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
            metric="mem.share"
            formatter={bytesTwoDecimalPlaces}
            optionalTimeWindowAggregation="mean"
          />
        ),
        sortable$: getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'mem.share'
        }).map(v => v[1])
      };
    }
  }
];
