'use strict';

import React from 'react';
import {IntlMixin} from 'react-intl';
import Map from 'instana-ui-map';
import {getZone} from 'instana-ui-sdk/zones';

import ConnectionStatus from './ConnectionStatus';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import DetailPane from './DetailPane';

import './App.less';

const App = React.createClass({
  mixins: [IntlMixin],

  getInitialState() {
    return {
      selectedSnapshot: null,
      sidebarVisible: false
    };
  },

  render() {
    return (
      <div>
        <Header sidebarVisible={this.state.sidebarVisible}
                onSidebarVisibilityChanged={this.setSidebarVisibility}
                onBack={this.back}
                backEnabled={!!this.state.selectedSnapshot}
                path={this.getPath()}/>

        <div style={{display: this.state.selectedSnapshot ? 'none' : 'block'}}>
          <Map onClick={this.openDashboard} />

          {this.state.sidebarVisible ?
            <Sidebar />
          : null}
        </div>

        {this.state.selectedSnapshot ?
          <DetailPane snapshot={this.state.selectedSnapshot} />
        : null}

        <Footer />
        <ConnectionStatus />
      </div>
    );
  },

  getPath() {
    const snapshot = this.state.selectedSnapshot;
    if (!snapshot) {
      return [];
    }

    const path = [];
    const zone = getZone(snapshot);
    path.push(zone);
    path.push(snapshot.getIn(['data', 'hostname']));
    return path;
  },

  setSidebarVisibility(visible) {
    this.setState({
      sidebarVisible: visible
    });
  },

  openDashboard(event) {
    this.setState({
      selectedSnapshot: event.snapshot
    });
  },

  back() {
    this.setState({
      selectedSnapshot: null
    });
  }

});

export default App;
