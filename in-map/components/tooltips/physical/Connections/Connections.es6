import React from 'react';

import ConnectionLine from 'in-map/components/tooltips/physical/Connections/components/ConnectionLine';
import createTooltip from 'in-map/components/tooltips/Tooltip';
import Heading from 'in-components/Tooltips/Heading';


export default createTooltip(
  function Connections({entity}) {
    const connections = entity;

    let sourceNodesAreAlwaysTheSame = true;
    const firstConnection = connections[0];

    // TODO: Race condition: nodes are gone but connections are not yet
    // Can we prevent this?
    if (!firstConnection.sourceNode) {
      return null;
    }

    let currentSourceNodeId = firstConnection.sourceNode.id;
    for (let i = 0; i < connections.length; i++) {
      const connection = connections[i];
      if (currentSourceNodeId !== connection.sourceNode.id) {
        sourceNodesAreAlwaysTheSame = false;
        break;
      }
      currentSourceNodeId = connection.sourceNode.id;
    }

    const direction = sourceNodesAreAlwaysTheSame ? 'in' : 'out';

    return (
      <div>
        <Heading>
          {connections.length + ' connection' + (connections.length === 1 ? '' : 's')}
        </Heading>
        {connections.map(connection => <ConnectionLine key={connection.id}
                                                       connection={connection}
                                                       direction={direction} />)}
      </div>
    );
  }
);
