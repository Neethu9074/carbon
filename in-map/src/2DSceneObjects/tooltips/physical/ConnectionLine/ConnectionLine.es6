import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import {getColorPool} from 'in-services/util/ColorGenerator';
import getSnapshot from 'in-hoc/getSnapshot';
import {getLabel} from 'in-sdk/snapshot';
import Icon from 'in-components/Icon';
import getZone from 'in-hoc/getZone';

import './ConnectionLine.less';


const rpt = React.PropTypes;
const block = 'in-connection-item';

const ConnectionLine = getZone(
                       getSnapshot(
                       React.createClass({

  displayName: 'ConnectionLine (Physical)',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    connection: rpt.object.isRequired,
    zoneSnapshot: irpt.map,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    const zoneSnapshot = this.props.zoneSnapshot;
    const connection = this.props.connection;
    const color = zoneSnapshot ? getColorPool('groups').getColorHex(zoneSnapshot.get('id')) : '';

    return (
      <div key={connection.id}
           className={block}>
        {connection.direction === DIRECTIONS.IN ?
          <Icon className={block + '__icon'} type={'arrow_left'}/> :
          <Icon className={block + '__icon'} type={'arrow_right'}/>
        }
        <span className={block + '__ip'}>
          {getLabel(snapshot)}
        </span>
        <span style={{color}}>
          {zoneSnapshot ? zoneSnapshot.getIn(['data', 'groupId']) : null}
        </span>
      </div>
    );
  }
})));

export function renderConnectionLine(connection) {
  return (
    <ConnectionLine key={connection.id}
                    snapshotId={connection.destinationNode.id}
                    connection={connection} />
  );
}
