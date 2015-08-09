

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {getHealth, health} from 'in-services/health';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {theme} from 'in-services/theme';

import Icon from '../Icon';

import './SnapshotIcon.less';

const SnapshotIcon = React.createClass({
  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    className: React.PropTypes.string
  },

  getInitialState() {
    return {
      health: health.ok
    };
  },

  componentDidMount() {
    this.addSubscription(
      getHealth(this.props.snapshot).subscribe(currentHealth =>
        this.setState({health: currentHealth})
      )
    );
  },

  render() {
    let classes = 'in-snapshot-icon';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <Icon type={this.getIcon()}
            style={this.getStyles()}
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
        iconType = 'warning';
        break;
      case health.danger:
        iconType = 'critical';
        break;
      default:
        throw new Error('Unknown health');
    }

    return iconType;
  },

  getStyles() {
    const style = {};

    switch(this.state.health) {
      case health.ok:
        style.color = '';
        break;
      case health.warning:
        style.color = theme.map.colors.warning;
        break;
      case health.danger:
        style.color = theme.map.colors.critical;
        break;
      default:
        throw new Error('Unknown health');
    }

    return style;
  }
});

export default SnapshotIcon;
