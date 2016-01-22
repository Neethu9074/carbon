import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getColorPool} from 'in-services/util/ColorGenerator';
import {getClassName} from 'in-services/react';
import getZone from 'in-hoc/getZone';

import './ZoneTag.less';


const rpt = React.PropTypes;
const block = 'in-zone-tag';

export default getZone(React.createClass({

  displayName: 'ZoneTag',

  mixins: [React.addons.PureRenderMixin],

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

    return (
      <div className={getClassName(this, block)}
           style={{color: getColorPool('groups').getColorHex(snapshot.get('id'))}}>
        {snapshot.getIn(['data', 'groupId'])}
      </div>
    );
  }
}));
