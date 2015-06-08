'use strict';

import React from 'react/addons';

import Icon from '../Icon';
import {getHealth, health} from 'instana-ui-services/health';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import './SnapshotIcon.less';

const SnapshotIcon = React.createClass({
  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  getInitialState() {
    return {
      health: health.ok
    };
  },

  componentDidMount() {
    this.addSubscription(
      getHealth(this.props.snapshot).subscribe(health =>
        this.setState({health}))
    );
  },

  render() {
    let classes = 'in-snapshot-icon';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <Icon type={this.getIcon()}
            className={classes}/>
    );
  },

  getIcon() {
    let iconType = '';

    switch(this.state.health) {
      case health.ok:
        iconType = '';
        break;
      case health.warning:
        iconType = 'grid';
        break;
      case health.danger:
        iconType = 'map';
        break;
      default:
        throw new Error('Unknown health');
    }

    return iconType;
  }
});

export default SnapshotIcon;
