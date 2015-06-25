'use strict';

import React from 'react/addons';
import {IntlMixin, FormattedMessage} from 'react-intl';
import {RouteHandler, Navigation} from 'react-router';

import Map from 'instana-ui-map';
import Issues from './Issues';
import Lettering from 'instana-ui-components/Lettering';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import * as constants from 'instana-ui-forge/constants';

import ConnectionStatus from './ConnectionStatus';
import Sidebar from './Sidebar';

import './App.less';

const App = React.createClass({
  mixins: [
    IntlMixin,
    SubscriptionMixin,
    React.addons.PureRenderMixin,
    Navigation
  ],

  getInitialState() {
    return {
      selectedSnapshot: null,
      pluginId: constants.plugins.os
    };
  },

  componentDidMount() {
    this.addSubscription(
      selectedSnapshotStore.selectedSnapshot.subscribe(selectedSnapshot => {
        this.setState({
          selectedSnapshot
        });
      })
    );
  },

  render() {
    const hasChildren = this.props.state.routes.length > 1;

    return (
      <div>
        <Lettering className='in-root-lettering' />

        <div style={{display: hasChildren ? 'none' : 'block'}}>
          <Map pluginId={this.state.pluginId} />

          <Sidebar pluginId={this.state.pluginId} />
        </div>

        {this.state.selectedSnapshot ?
          <button type='button'
                  className='in-switch-to-dashboard'
                  onClick={this.openDashboard}>
            {this.getIntlMessage('main.switchToDashboard')}
          </button>
        : null}

        <Issues />
        <RouteHandler/>
        <ConnectionStatus />
      </div>
    );
  },

  openDashboard() {
    this.transitionTo(
      'dashboard',
      {
        pluginId: this.state.selectedSnapshot.get('pluginId'),
        steadyId: this.state.selectedSnapshot.get('steadyId'),
        hostId: this.state.selectedSnapshot.get('hostId')
      }
    );
  }

});

export default App;
