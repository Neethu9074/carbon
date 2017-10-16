import { Switch, Route } from 'react-router-dom';
import React from 'react';

import ConnectionSummary from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/ConnectionSummary';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getSnapshot, getSnapshots } from 'in-stores/snapshot';
import { compareIgnoreCase } from 'in-services/util/string';
import { logicalViewStructure$ } from 'in-stores/view';
import Table from 'in-sdk/components/dashboard/Table';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

const cols = [
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
  }
];

export default function Connections({ snapshot, timeframe }) {
  return (
    <Switch>
      <Route
        path={`*/dashboard/connections/:connectionId`}
        render={({ match }) => {
          const connectionId = match.params.connectionId;
          return <ConnectionDashboard snapshotId={connectionId} timeframe={timeframe} />;
        }}
      />
      <Route
        path={`*/dashboard*`}
        render={() => {
          return (
            <MaxWidthFullscreenContainer>
              <DashboardTile title="Incoming">
                <ConnectionsTable snapshot={snapshot} property="incomingConnections" />
              </DashboardTile>
              <DashboardTile title="Outgoing">
                <ConnectionsTable snapshot={snapshot} property="outgoingConnections" />
              </DashboardTile>
            </MaxWidthFullscreenContainer>
          );
        }}
      />
    </Switch>
  );
}

const ConnectionDashboard = connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  },
  function ConnectionDashboard({ snapshot, timeframe }) {
    if (!snapshot) {
      return <MaxWidthFullscreenContainer />;
    }
    return <ConnectionSummary snapshot={snapshot} timeframe={timeframe} />;
  }
);

const ConnectionsTable = connectTo(
  props => {
    const snapshotId = props.snapshot.get('id');
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
      connections: entity$.flatMap(entity => getSnapshots(entity[props.property].map(c => c.id)))
    };
  },
  function ConnectionsTable({ connections }) {
    let rows;
    if (!connections) {
      rows = [];
    } else {
      rows = connections.map(connection => {
        return {
          key: connection.get('id'),
          snapshot: connection,
          connection
        };
      });
    }

    return <Table cols={cols} rows={rows} />;
  }
);
