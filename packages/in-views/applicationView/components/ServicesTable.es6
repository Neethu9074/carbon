import { fromJS } from 'immutable';
import React from 'react';

import { percentageTwoDecimalPlaces, number } from 'in-services/formatters/number';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import getServices from 'in-subscription/application/getServices';
import SearchableTable from 'in-components/SearchableTable';
import { compareIgnoreCase } from 'in-services/util/string';
import { always } from 'in-services/fixedStreams';
import { getSingular } from 'in-sdk/pluginName';
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
    title: 'Type',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return getSingular(row.snapshot.get('plugin'));
      }
    }
  },
  {
    title: 'Applications',
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
    services: always(
      fromJS(
        [
          'defaultLogicalService',
          'ejbLogicalService',
          'defaultLogicalService',
          'defaultLogicalService',
          'shellLogicalService',
          'browserLogicalService',
          'defaultLogicalService',
          'defaultLogicalService',
          'defaultLogicalService'
        ].map((plugin, i) => ({
          id: `${i}`,
          label: `Service ${i}`,
          plugin
        }))
      )
    ),

    dummySubscription: getServices()
  },
  function ServicesTable({ services, dummySubscription }) {
    // eslint-disable-next-line no-console
    console.log('dummySubscription', dummySubscription);
    const rows = services.toArray().map(snapshot => ({ key: snapshot.get('id'), snapshot }));

    return <SearchableTable maxItemsPerPage={16} cols={cols} rows={rows} initialSortColumn={0} />;
  }
);
