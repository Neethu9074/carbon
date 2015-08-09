

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getHealth} from 'in-services/issueTracker';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';
import Icon from 'in-components/Icon';

const rpt = React.PropTypes;

const HealthIcon = React.createClass({
  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    className: rpt.string
  },

  getInitialState() {
    return {
      health: health.ok
    };
  },

  componentDidMount() {
    this.addSubscription(
      getHealth(this.props.snapshot).subscribe(snapshotHealth => {
        this.setState({health: snapshotHealth});
      })
    );
  },

  render() {
    if (this.state.health === health.ok) {
      return null;
    }

    let color;
    let type;

    switch (this.state.health) {
      case health.warning:
        type = 'warning';
        color = theme.health.warning;
        break;
      case health.danger:
        type = 'critical';
        color = theme.health.danger;
        break;
      default:
        throw new Error('Unrecognized health ' + this.state.health);
    }

    return (<Icon style={{color}}
                  type={type}
                  className={this.props.className}/>);
  }
});

export default HealthIcon;
