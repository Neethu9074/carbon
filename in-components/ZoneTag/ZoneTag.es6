import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getColorPool} from 'in-services/util/ColorGenerator';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {getClassName} from 'in-services/react';
import getZone from 'in-hoc/getZone';

import './ZoneTag.less';

const rpt = React.PropTypes;
const block = 'in-zone-tag';

export default getZone(React.createClass({

  displayName: 'ZoneTag',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    zoneSnapshot: irpt.map,
    className: rpt.string
  },

  render() {
    const snapshot = this.props.zoneSnapshot;
    if (!snapshot) {
      return null;
    }

    const id = snapshot.get('id');
    const color = getColorPool('groups').getColorHex(id);

    return (
      <div className={getClassName(this, block)}
           onClick={() => setSelectedSnapshotId(id)}
           style={{color}}>
        {snapshot.getIn(['data', 'groupId'])}
      </div>
    );
  }
}));
