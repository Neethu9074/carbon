import React from 'react';

import ConnectionLine from 'in-map/components/tooltips/physical/Connections/components/ConnectionLine';
import createTooltip from 'in-map/components/tooltips/Tooltip';
import { selectedSnapshotId$ } from 'in-stores/snapshot';
import Heading from 'in-components/Tooltips/Heading';
import connectTo from 'in-hoc/connectTo';

export default createTooltip(
  connectTo(
    {
      selectedSnapshotId: selectedSnapshotId$
    },
    function Connections({ entity, selectedSnapshotId }) {
      const connections = entity;
      return (
        <div>
          <Heading>
            {connections.length + ' connection' + (connections.length === 1 ? '' : 's')}
          </Heading>
          {connections.map(connection => (
            <ConnectionLine
              key={connection.id}
              connection={connection}
              nodeIdWhereConnectionsBelongTo={selectedSnapshotId}
            />
          ))}
        </div>
      );
    }
  )
);
