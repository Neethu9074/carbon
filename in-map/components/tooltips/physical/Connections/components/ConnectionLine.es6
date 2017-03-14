import React from 'react';

import {getColorPool} from 'in-services/util/ColorGenerator';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import {getZone} from 'in-stores/zone';

import 'in-map/components/tooltips/physical/Connections/components/ConnectionLine.less';


const block = 'in-connection-item';

export default connectTo(props => {
  if (!props.connection.sourceNode || !props.connection.destinationNode) {
    return {};
  }

  const otherId = props.connection.sourceNode.id === props.nodeIdWhereConnectionsBelongTo
    ? props.connection.destinationNode.id
    : props.connection.sourceNode.id;

  return {
    otherSnapshot: getSnapshot(otherId),
    otherZoneSnapshot: getZone(otherId).flatMap(id => id ? getSnapshot(id) : alwaysNull)
  };
},
function ConnectionLine({otherSnapshot, otherZoneSnapshot, connection, nodeIdWhereConnectionsBelongTo}) {
  if (!connection.sourceNode || !connection.destinationNode) {
    return null;
  }

  let otherColor = '';
  let zoneLabel = null;
  if (otherZoneSnapshot) {
    otherColor = getColorPool('groups').getColorHex(otherZoneSnapshot.get('id'));
    zoneLabel = getLabel(otherZoneSnapshot);
  }

  const direction = connection.sourceNode.id === nodeIdWhereConnectionsBelongTo ? 'out' : 'in';

  return (
    <div className={block}>
      {direction}

      <span className={block + '__ip'}>
        {getLabel(otherSnapshot)}
      </span>

      <span style={{ color: otherColor }}>
        {zoneLabel}
      </span>
    </div>
  );
});
