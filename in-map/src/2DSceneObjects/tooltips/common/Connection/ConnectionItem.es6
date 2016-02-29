import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import {getColorPool} from 'in-services/util/ColorGenerator';
import getSnapshot from 'in-hoc/getSnapshot';
import Icon from 'in-components/Icon';
import getZone from 'in-hoc/getZone';

import {getOneOfConnectedIps} from './snapshotIpExtraction';

import './ConnectionItem.less';


const rpt = React.PropTypes;
const block = 'in-connection-item';

const ConnectionItem = getZone(getSnapshot(React.createClass({

  displayName: 'ConnectionItem',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    direction: rpt.string.isRequired,
    sourceSnapshot: irpt.map,
    zoneSnapshot: irpt.map,
    snapshot: irpt.map
  },

  render() {
    const sourceSnapshot = this.props.sourceSnapshot;
    const zoneSnapshot = this.props.zoneSnapshot;
    const snapshot = this.props.snapshot;
    if (!snapshot || !sourceSnapshot) {
      return null;
    }

    const ip = getOneOfConnectedIps(sourceSnapshot, snapshot);
    const color = zoneSnapshot ? getColorPool('groups').getColorHex(zoneSnapshot.get('id')) : '';

    return (
      <div className={block}>
        {this.props.direction === DIRECTIONS.IN ?
          <Icon className={block + '__icon'} type={'arrow_left'}/> :
          <Icon className={block + '__icon'} type={'arrow_right'}/>
        }
        <span className={block + '__ip'}>
          {ip}
        </span>
        <span style={{color}}>
          {zoneSnapshot ? zoneSnapshot.getIn(['data', 'groupId']) : null}
        </span>
      </div>
    );
  }
})));

export default ConnectionItem;
