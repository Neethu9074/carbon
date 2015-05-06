'use strict';

import './App.less';

import React from 'react/react';
import Map from 'instana-ui-map';

import Sidebar from './Sidebar';
import Notifications from './Notifications';

const App = React.createClass({
  getInitialState() {
    return {
    };
  },

  render() {
    return (
      <div>
        {__DEV__ ? <Notifications onClick={this.onNotificationClick} /> : null}

        <Map ref="map" />
        <Sidebar />
      </div>
    );
  },

  onNotificationClick(snapshotId) {
    this.refs.map.focus(snapshotId);
  }

});

export default App;
