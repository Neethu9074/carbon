import React from 'react';

import ConnectionLine from 'in-map/components/tooltips/physical/Connections/components/ConnectionLine';
import createTooltip from 'in-map/components/tooltips/Tooltip';
import Heading from 'in-components/Tooltips/Heading';


export default createTooltip(
  function Connections({entity}) {
    const connections = entity;

    return (
      <div>
        <Heading>
          {connections.length + ' connection' + (connections.length === 1 ? '' : 's')}
        </Heading>
        {connections.map(connection => <ConnectionLine key={connection.id}
                                                       connection={connection} />)}
      </div>
    );
  }
);
