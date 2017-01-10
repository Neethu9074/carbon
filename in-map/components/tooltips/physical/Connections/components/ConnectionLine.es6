import React from 'react';

import {getColorPool} from 'in-services/util/ColorGenerator';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import {getZone} from 'in-stores/zone';
import Icon from 'in-components/Icon';

import 'in-map/components/tooltips/physical/Connections/components/ConnectionLine.less';


const block = 'in-connection-item';

export default connectTo(props => {
  if (!props.connection || !props.connection.sourceNode) {
    return {};
  }

  const sourceId = props.connection.sourceNode.id;

  return {
    sourceSnapshot: getSnapshot(sourceId),
    sourceZoneSnapshot: getZone(sourceId).flatMap(id => id ? getSnapshot(id) : alwaysNull)
  };
},
function ConnectionLine({sourceSnapshot, sourceZoneSnapshot, direction}) {
  let sourceColor = '';
  let zoneLabel = null;
  if (sourceZoneSnapshot) {
    sourceColor = getColorPool('groups').getColorHex(sourceZoneSnapshot.get('id'));
    zoneLabel = getLabel(sourceZoneSnapshot);
  }

  return (
    <div className={block}>
      <Icon className={block + '__icon'} type={direction === 'in' ? 'arrow_right' : 'arrow_left'} />

      <span className={block + '__ip'}>
        {getLabel(sourceSnapshot)}
      </span>

      <span style={{sourceColor}}>
        {zoneLabel}
      </span>
    </div>
  );
});
