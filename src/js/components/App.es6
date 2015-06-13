'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import {RouteHandler, Navigation} from 'react-router';

import Map from 'instana-ui-map';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import * as sidebarStore from 'instana-ui-services/stores/sidebar';

import ConnectionStatus from './ConnectionStatus';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

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
      sidebarVisible: false
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

    this.addSubscription(
      sidebarStore.visibility.subscribe(sidebarVisible => {
        this.setState({
          sidebarVisible
        });
      })
    );
  },

  render() {
    const hasChildren = this.props.state.routes.length > 1;
    return (
      <div>
        <Header selectedSnapshot={this.state.selectedSnapshot}
                sidebarVisible={this.state.sidebarVisible} />

        <div style={{display: hasChildren ? 'none' : 'block'}}>
          <Map onClick={this.openDashboard} />

          {this.state.sidebarVisible ?
            <Sidebar />
          : null}
        </div>

        <RouteHandler/>

        <Footer />
        <ConnectionStatus />
      </div>
    );
  },

  setSidebarVisibility(visible) {
    this.setState({
      sidebarVisible: visible
    });
  },

  openDashboard(event) {
    this.transitionTo(
      'detail-pane',
      {
        pluginId: event.snapshot.get('pluginId'),
        steadyId: event.snapshot.get('steadyId'),
        hostId: event.snapshot.get('hostId')
      }
    );
  }

});

export default App;
