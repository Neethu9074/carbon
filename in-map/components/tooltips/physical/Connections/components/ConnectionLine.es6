import React from 'react';

import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
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
  const sourceId = props.connection.sourceNode.id;
  const destinationId = props.connection.destinationNode.id;

  return {
    sourceSnapshot: getSnapshot(sourceId),
    sourceZoneSnapshot: getZone(sourceId).flatMap(id => id ? getSnapshot(id) : alwaysNull),
    destinationSnapshot: getSnapshot(destinationId),
    destinationZoneSnapshot: getZone(destinationId).flatMap(id => id ? getSnapshot(id) : alwaysNull)
  };
},
function ConnectionLine({connection,
                         sourceSnapshot,
                         sourceZoneSnapshot}) {

  const sourceColor = sourceZoneSnapshot ? getColorPool('groups').getColorHex(sourceZoneSnapshot.get('id')) : '';

  return (
    <div className={block}>
      {connection.direction === DIRECTIONS.IN ?
        <Icon className={block + '__icon'} type={'arrow_left'}/> :
        <Icon className={block + '__icon'} type={'arrow_right'}/>
      }
      <span className={block + '__ip'}>
        {getLabel(sourceSnapshot)}
      </span>
      <span style={{sourceColor}}>
        {sourceZoneSnapshot ? getLabel(sourceZoneSnapshot) : null}
      </span>
    </div>
  );
});
