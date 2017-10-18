/* eslint-disable no-console */
import React from 'react';

import ConnectionSankey from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Connections/ConnectionSankey';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { number, millis, percentage } from 'in-services/formatters/number';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getConnectedEntities } from 'in-stores/connectedEntities';
import { getSnapshot, getSnapshots } from 'in-stores/snapshot';
import { compareIgnoreCase } from 'in-services/util/string';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { logicalViewStructure$ } from 'in-stores/view';
import Table from 'in-sdk/components/dashboard/Table';
import { always } from 'in-services/fixedStreams';
import PluginIcon from 'in-components/PluginIcon';
import SvgIcon from 'in-components/SvgIcon';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './ConnectionOverview.less';

const block = 'in-service-connection-dashboard-overview';

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
          content: (
            <SvgIcon
              type={row.type === 'incoming' ? 'arrow_right' : 'arrow_left'}
              color="#40535b"
              height={12}
              width={12}
            />
          )
        };
      }
    }
  },
  {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: () => compareIgnoreCase,
      get$(row) {
        return getConnectedEntities(row.key).flatMap(connectedEntities => {
          const id = row.type === 'incoming' ? 'sourceId' : 'destinationId';
          if (!connectedEntities || !connectedEntities.get(id)) {
            return always({
              value: '',
              content: <ConnectionLink snapshot={row.snapshot}>unknown</ConnectionLink>
            });
          }
          return getSnapshot(connectedEntities.get(id)).map(snapshot => {
            const label = getLabel(snapshot);
            return {
              value: label,
              content: (
                <ConnectionLink pluginSnapshot={snapshot} snapshot={row.snapshot}>
                  {label}
                </ConnectionLink>
              )
            };
          });
        });
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
        <ConnectionsTable snapshot={snapshot} type="incoming" />
      </DashboardTile>
      <DashboardTile title="Outgoing">
        <ConnectionsTable snapshot={snapshot} type="outgoing" />
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
    const property = props.type === 'incoming' ? 'incomingConnections' : 'outgoingConnections';
    return {
      connections: entity$.flatMap(
        entity => (entity ? getSnapshots(entity[property].map(c => c.id)) : alwaysEmptyArray)
      )
    };
  },
  function ConnectionsTable({ connections, type }) {
    let rows;
    if (!connections) {
      rows = [];
    } else {
      rows = connections.map(connection => {
        return {
          key: connection.get('id'),
          snapshot: connection,
          type,
          connection
        };
      });
    }

    return <Table cols={cols} rows={rows} />;
  }
);

function ConnectionLink({ pluginSnapshot, snapshot, children }) {
  return (
    <Link className={`${block}__link`} href$={getSubDashboardLink(`/connections/${snapshot.get('id')}`)}>
      <PluginIcon className={`${block}__plugin-icon`} snapshot={pluginSnapshot} color="#2D4048" dimension={12} />
      {children}
    </Link>
  );
}
