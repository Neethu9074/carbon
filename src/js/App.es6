'use strict';

import React from 'react';
import {IntlMixin} from 'react-intl';
import Map from 'instana-ui-map';

import ConnectionStatus from './ConnectionStatus';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

import './App.less';

const App = React.createClass({
  mixins: [IntlMixin],

  getInitialState() {
    return {
      sidebarVisible: false
    };
  },

  render() {
    return (
      <div>
        <Header sidebarVisible={this.state.sidebarVisible}
                onSidebarVisibilityChanged={this.setSidebarVisibility} />
        <Map onClick={this.openDashboard} />


        {this.state.sidebarVisible ?
          <Sidebar />
        : null}

        <ConnectionStatus />
        <Footer />
      </div>
    );
  },

  setSidebarVisibility(visible) {
    this.setState({
      sidebarVisible: visible
    });
  },

  openDashboard(snapshot) {
    console.log(snapshot);
  }

});

export default App;
