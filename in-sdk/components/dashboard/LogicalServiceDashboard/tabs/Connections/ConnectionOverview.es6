/* eslint-disable no-console */
import React from 'react';

import ConnectionSankey from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Connections/ConnectionSankey';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { number, millis, percentage } from 'in-services/formatters/number';
import { getLogicalConnections } from 'in-services/logicalConnections';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getConnectedEntities } from 'in-stores/connectedEntities';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { always } from 'in-services/fixedStreams';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './ConnectionOverview.less';

const block = 'in-service-connection-dashboard-overview';

const cols = [
  {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        return getSnapshot(row.key).flatMap(connectionSnapshot =>
          getConnectedEntities(row.key).flatMap(connectedEntities => {
            const id = row.type === 'incoming' ? 'sourceId' : 'destinationId';
            if (!connectedEntities || !connectedEntities.get(id)) {
              return always({
                value: '',
                content: <ConnectionLink snapshot={connectionSnapshot}>unknown</ConnectionLink>
              });
            }
            return getSnapshot(connectedEntities.get(id)).map(snapshot => {
              const label = getLabel(snapshot);
              return {
                value: label,
                content: (
                  <ConnectionLink pluginSnapshot={snapshot} snapshot={connectionSnapshot}>
                    {label}
                  </ConnectionLink>
                )
              };
            });
          })
        );
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
      <ConnectionsTable title="Incoming" snapshot={snapshot} type="incoming" />
      <ConnectionsTable title="Outgoing" snapshot={snapshot} type="outgoing" />
    </MaxWidthFullscreenContainer>
  );
}

const ConnectionsTable = connectTo(
  props => {
    return {
      connections: getLogicalConnections(props.snapshot.get('id'))
    };
  },
  function ConnectionsTable({ connections, type, title }) {
    let rows;
    if (!connections) {
      rows = [];
    } else {
      rows = connections
        .toArray()
        .filter(connection => connection.get('direction', '').toLowerCase() === type)
        .map(connection => {
          return {
            key: connection.get('connectionSnapshotId'),
            type
          };
        });
    }

    return (
      <DashboardTile title={`${title} (${rows.length})`}>
        <Table cols={cols} rows={rows} />
      </DashboardTile>
    );
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
