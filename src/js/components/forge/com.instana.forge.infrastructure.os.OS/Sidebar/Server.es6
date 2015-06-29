'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import * as highlightedSnapshotStore from 'instana-ui-services/stores/highlightedSnapshot';

import {getHealth} from 'instana-ui-services/issueTracker';
import {health} from 'instana-ui-services/health';
import classnames from 'instana-ui-services/util/classnames';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {getLabel} from 'instana-ui-sdk/snapshot';
import Icon from 'instana-ui-components/Icon';
import {theme} from 'instana-ui-services/theme';

import './Server.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-server-listing__snapshot';

const Server = React.createClass({
  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    highlighted: rpt.bool.isRequired,
    wired: rpt.bool.isRequired
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
    return (
      <li className={classnames({
            [block]: true,
            [block + '--highlighted']: this.props.highlighted,
            [block + '--wired']: this.props.wired
          })}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}>
        {getLabel(this.props.snapshot)}
        {this.renderHealthIcon()}
      </li>
    );
  },

  renderHealthIcon() {
    // no need to paint anything when the snapshot is doing okay
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
                  className={block + '-health'}/>);
  },

  onClick() {
    selectedSnapshotStore.select(this.props.snapshot);
  },

  onMouseEnter() {
    highlightedSnapshotStore.select(this.props.snapshot);
  },

  onMouseLeave() {
    highlightedSnapshotStore.clear();
  }
});

export default Server;
