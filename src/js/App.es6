'use strict';

import './App.less';

import React from 'react/react';
import Map from 'instana-ui-map';

import Notifications from './Notifications';

const App = React.createClass({
	getInitialState() {
		return {
		};
	},

  render() {
    return (
      <div>
				<Notifications onClick={this.onNotificationClick} />
        <Map ref="map" />
      </div>
    );
  },

	onNotificationClick(snapshotId) {
		this.refs.map.focus(snapshotId);
	}

});

export default App;
