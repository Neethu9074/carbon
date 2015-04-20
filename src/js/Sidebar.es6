'use strict';

import './Sidebar.less';

import React from 'react';
import {create} from 'instana-ui-services/conveyer';
import InventoryConveyer from 'instana-ui-services/conveyer/InventoryConveyer';

import LoadingIndicator from './LoadingIndicator';
import OperatingSystemSidebar from './OperatingSystemSidebar';

const Sidebar = React.createClass({
  propTypes: {
    pluginId: React.PropTypes.string.isRequired,
    hostId: React.PropTypes.string.isRequired,
    steadyId: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      snapshot: null,
      subscription: null
    };
  },

  componentDidMount() {
    this.startObservation(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.stopObservation();
    this.startObservation(nextProps);
  },

  componentWillUnmount() {
    this.stopObservation();
  },

  startObservation(props) {
    const subscription = create(InventoryConveyer, {
      pluginId: props.pluginId
    })
    .map(hosts => {
      return hosts.find(host => {
        return host.get('pluginId') === props.pluginId &&
          host.get('steadyId') === props.steadyId &&
          host.get('hostId') === props.hostId;
      });
    })
    .forEach(host => this.setState({snapshot: host}));

    this.setState({
      subscription
    });
  },

  stopObservation() {
    if (this.state.subscription) {
      this.state.subscription.dispose();
      this.setState({
        subscription: null,
        snapshot: null
      });
    }
  },

  render() {
    return (
      <div className="in-sidebar">
        <h1>
          {this.props.hostId}
          <small>
            {this.props.steadyId}
          </small>
        </h1>

        {this.state.snapshot ?
          <OperatingSystemSidebar snapshot={this.state.snapshot} />
        : <LoadingIndicator />}
      </div>
    );
  }
});

export default Sidebar;
