/* eslint-disable no-console */

import React from 'react';

import ConnectionSankey from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Connections/ConnectionSankey';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { number, millis, percentage } from 'in-services/formatters/number';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { compareIgnoreCase } from 'in-services/util/string';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { logicalViewStructure$ } from 'in-stores/view';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshots } from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

const cols = [
  {
    title: '',
    type: 'custom',
    width: 20,
    disableSorting: true,
    typeArgs: {
      comparator: () => 0,
      get(row) {
        return {
          value: 0,
          content: <SvgIcon type={row.iconType} color="#40535b" height={12} width={12} />
        };
      }
    }
  },
  {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: () => compareIgnoreCase,
      get(row) {
        const label = getLabel(row.connection);
        return {
          value: label,
          content: <Link href$={getSubDashboardLink(`/connections/${row.key}`)}>{label}</Link>
        };
      }
    }
  },
  {
    title: 'Calls (sum)',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Latency (avg)',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'duration.mean';
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Error Rate (avg)',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'error_rate';
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConnectionOverview({ snapshot, timeframe }) {
  return (
    <MaxWidthFullscreenContainer>
      <ConnectionSankey snapshot={snapshot} timeframe={timeframe} />

      <DashboardTile title="Incoming">
        <ConnectionsTable snapshot={snapshot} property="incomingConnections" iconType="arrow_right" />
      </DashboardTile>
      <DashboardTile title="Outgoing">
        <ConnectionsTable snapshot={snapshot} property="outgoingConnections" iconType="arrow_left" />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}

const ConnectionsTable = connectTo(
  props => {
    const snapshotId = props.snapshot.get('id');
    console.warn(
      'Do not rely on logical view structure! This is expensive to retrieve. Please use special subscriptions for this.'
    );
    const entity$ = logicalViewStructure$.map(root => {
      for (let i = 0, length = root.children.length; i < length; i++) {
        const item = root.children[i];
        if (item.id === snapshotId) {
          return item;
        }
      }
      return null;
    });
    return {
      connections: entity$.flatMap(
        entity => (entity ? getSnapshots(entity[props.property].map(c => c.id)) : alwaysEmptyArray)
      )
    };
  },
  function ConnectionsTable({ connections, iconType }) {
    let rows;
    if (!connections) {
      rows = [];
    } else {
      rows = connections.map(connection => {
        return {
          key: connection.get('id'),
          snapshot: connection,
          iconType: iconType,
          connection
        };
      });
    }

    return <Table cols={cols} rows={rows} />;
  }
);
