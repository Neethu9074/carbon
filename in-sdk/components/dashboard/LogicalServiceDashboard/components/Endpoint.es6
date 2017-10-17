import React from 'react';

import { getConnectedEntities } from 'in-stores/connectedEntities';
import EntityInformation from 'in-components/EntityInformation';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      endpointSnapshot: getConnectedEntities(props.snapshotId).flatMap(connectedEntity => {
        const id = props.type === 'source' ? 'sourceId' : 'destinationId';
        if (!connectedEntity || !connectedEntity.get(id)) {
          return alwaysNull;
        }
        return getSnapshot(connectedEntity.get(id));
      })
    };
  },
  function Endpoint({ endpointSnapshot, type }) {
    if (!endpointSnapshot) {
      return null;
    }
    return (
      <div>
        <EntityInformation label={`${type}: `} snapshot={endpointSnapshot} />
      </div>
    );
  }
);
