import React from 'react';

import DefaultCharts from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultConnectionCharts';
import LogicalEntityTable from 'in-components/LogicalEntityTables/LogicalEntityTable';
import {getConnectedEntities} from 'in-stores/connectedEntities';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    connectedEntities: getConnectedEntities(props.snapshot.get('id'))
  };
}, ConnectedEntitiesTable);

function ConnectedEntitiesTable({timeframe, connectedEntities}) {
  if (!connectedEntities) {
    return null;
  }

  const sourceId = connectedEntities.get('sourceId');
  const destinationId = connectedEntities.get('destinationId');

  return (
    <div>
      { sourceId ?
        <LogicalEntityTable timeframe={timeframe}
                            title={'Downstream'}
                            dataStream={getSnapshot(destinationId).map(_snapshot => [_snapshot])}
                            createDetails={createDetails} />
        : null
      }
      { destinationId ?
        <LogicalEntityTable timeframe={timeframe}
                            title={'Upstream'}
                            dataStream={getSnapshot(sourceId).map(_snapshot => [_snapshot])}
                            createDetails={createDetails} />
        : null
      }
    </div>
  );
}

function createDetails(nodeSnapshot, index, context) {
  return (
    <DefaultCharts snapshot={nodeSnapshot}
                   timeframe={context.timeframe} />
  );
}
