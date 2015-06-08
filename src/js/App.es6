'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import Map from 'instana-ui-map';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import * as selectedSnapshotStore from './stores/selectedSnapshot';
import * as sidebarStore from './stores/sidebar';

import ConnectionStatus from './ConnectionStatus';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import DetailPane from './DetailPane';

import './App.less';

const App = React.createClass({
  mixins: [IntlMixin, SubscriptionMixin, React.addons.PureRenderMixin],

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
    return (
      <div>
        <Header selectedSnapshot={this.state.selectedSnapshot}
                sidebarVisible={this.state.sidebarVisible} />

        <div style={{display: this.state.selectedSnapshot ? 'none' : 'block'}}>
          <Map onClick={this.openDashboard} />

          {this.state.sidebarVisible ?
            <Sidebar />
          : null}
        </div>

        {this.state.selectedSnapshot ?
          <DetailPane snapshot={this.state.selectedSnapshot}
                      sidebarVisible={this.state.sidebarVisible} />
        : null}

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
    selectedSnapshotStore.select(event.snapshot);
  }

});

export default App;
