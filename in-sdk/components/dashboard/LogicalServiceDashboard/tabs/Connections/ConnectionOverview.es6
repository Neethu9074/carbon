import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { compareIgnoreCase } from 'in-services/util/string';
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
  }
];

export default function ConnectionOverview({snapshot}) {
  return (
    <MaxWidthFullscreenContainer>
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
