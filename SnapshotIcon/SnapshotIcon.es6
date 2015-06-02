'use strict';

import React from 'react/addons';

import Icon from '../Icon';
import {getIcon} from 'instana-ui-sdk/snapshotIcon';
import {getColor, getZone} from 'instana-ui-sdk/zones';
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
      getHealth(this.props.snapshot).subscribe(health => {
        this.setState({
          health
        });
      })
    );
  },

  render() {
    let classes = 'in-snapshot-icon';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <Icon type={getIcon(this.props.snapshot)}
            style={this.getStyles()}
            className={classes}/>
    );
  },

  getStyles() {
    const styles = {};

    switch(this.state.health) {
      case health.ok:
        styles.borderColor = getColor(getZone(this.props.snapshot));
        break;
      case health.warning:
        styles.borderColor = '#F3BA09';
        styles.backgroundColor = '#575014';
        break;
      case health.danger:
        styles.borderColor = '#B61531';
        styles.backgroundColor = '#551424';
        break;
      default:
        throw new Error('Unknown health');
    }

    return styles;
  }
});

export default SnapshotIcon;
