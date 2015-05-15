'use strict';

import React from 'react/addons';

import Icon from '../Icon';
import {getIcon} from 'instana-ui-sdk/snapshotIcon';
import {getColor, getZone} from 'instana-ui-sdk/zones';

import './SnapshotIcon.less';

const SnapshotIcon = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <Icon type={getIcon(this.props.snapshot)}
            style={{borderColor: getColor(getZone(this.props.snapshot))}}
            className='in-snapshot-icon'/>
    );
  }
});

export default SnapshotIcon;
