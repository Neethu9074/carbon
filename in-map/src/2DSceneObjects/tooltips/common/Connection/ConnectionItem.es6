import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import {getColorPool} from 'in-services/util/ColorGenerator';
import getSnapshot from 'in-hoc/getSnapshot';
import {getLabel} from 'in-sdk/snapshot';
import Icon from 'in-components/Icon';
import getZone from 'in-hoc/getZone';

import './ConnectionItem.less';


const rpt = React.PropTypes;
const block = 'in-connection-item';

const ConnectionItem = getZone(
                       getSnapshot(
                       React.createClass({

  displayName: 'ConnectionItem',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    direction: rpt.string.isRequired,
    zoneSnapshot: irpt.map,
    snapshot: irpt.map
  },

  render() {
    const zoneSnapshot = this.props.zoneSnapshot;
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    const color = zoneSnapshot ? getColorPool('groups').getColorHex(zoneSnapshot.get('id')) : '';

    return (
      <div className={block}>
        {this.props.direction === DIRECTIONS.IN ?
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

export default ConnectionItem;
