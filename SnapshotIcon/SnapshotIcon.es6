'use strict';

import React from 'react/addons';

import Icon from '../Icon';
import {getIcon} from 'instana-ui-sdk/snapshotIcon';
import {getColor, getZone} from 'instana-ui-sdk/zones';

import './SnapshotIcon.less';

const SnapshotIcon = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    let classes = 'in-snapshot-icon';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <Icon type={getIcon(this.props.snapshot)}
            style={{borderColor: getColor(getZone(this.props.snapshot))}}
            className={classes}/>
    );
  }
});

export default SnapshotIcon;
