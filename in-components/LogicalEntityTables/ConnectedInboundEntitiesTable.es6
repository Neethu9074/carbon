import React from 'react';

import DefaultCharts from 'in-sdk/components/dashboard/DefaultLogicalConnectionDashboard/DefaultConnectionCharts';
import LogicalConnectionEntityTable from 'in-components/LogicalEntityTables/LogicalConnectionEntityTable';
import { getConnectedEntities } from 'in-stores/connectedEntities';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      connectedEntities: getConnectedEntities(props.snapshot.get('id'))
    };
  },
  ConnectedEntitiesTable
);

function ConnectedEntitiesTable({ timeframe, connectedEntities }) {
  if (!connectedEntities) {
    return null;
  }

  const id = connectedEntities.get('sourceId');
  if (!id) {
    return null;
  }

  return (
    <LogicalConnectionEntityTable
      timeframe={timeframe}
      title={'Connection From'}
      dataStream={getSnapshot(id).map(_snapshot => [_snapshot])}
      createDetails={createDetails}
    />
  );
}

function createDetails(nodeSnapshot, index, context) {
  return <DefaultCharts snapshot={nodeSnapshot} timeframe={context.timeframe} />;
}
