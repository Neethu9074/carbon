import { fromJS } from 'immutable';
import React from 'react';

import { percentageTwoDecimalPlaces, number } from 'in-services/formatters/number';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import SearchableTable from 'in-components/SearchableTable';
import { compareIgnoreCase } from 'in-services/util/string';
import { always } from 'in-services/fixedStreams';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

const cols = [
  {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,

      get(row) {
        return {
          value: getLabel(row.snapshot),
          content: <Link href$={getSubDashboardLink('/')}>{getLabel(row.snapshot)}</Link>
        };
      }
    }
  },
  {
    title: 'Services',
    type: 'number',
    width: 100,
    typeArgs: {
      getValue() {
        return (Math.random() * 10) | 0;
      },
      getContent: number.compact
    }
  },
  {
    title: 'Endpoints',
    type: 'number',
    width: 100,
    typeArgs: {
      getValue() {
        return (Math.random() * 10) | 0;
      },
      getContent: number.compact
    }
  },
  {
    title: 'Calls',
    type: 'metric',
    width: 150,
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'unknown_metric';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Latency',
    type: 'metric',
    width: 150,
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'unknown_metric';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Errors',
    type: 'number',
    width: 100,
    typeArgs: {
      getValue() {
        return Math.random();
      },
      getContent: percentageTwoDecimalPlaces
    }
  }
];

export default connectTo(
  {
    applications: always(
      fromJS(
        [1, 2, 3, 4, 5].map(i => ({
          id: `${i}`,
          label: `Application ${i}`,
          plugin: 'application'
        }))
      )
    )
  },
  function ApplicationsTable({ applications }) {
    const rows = applications.toArray().map(snapshot => ({
      key: snapshot.get('id'),
      snapshot
    }));

    return <SearchableTable maxItemsPerPage={16} cols={cols} rows={rows} initialSortColumn={0} />;
  }
);
