'use strict';

import './App.less'

import Immutable from 'immutable';
import React from 'react/react';
import Map from 'instana-ui-map';
import Sidebar from './Sidebar';

const App = React.createClass({
	getInitialState() {
		return {
			selectedSnapshot: null
		};
	},

  render() {
    return (
      <div>
				{this.state.selectedSnapshot ?
					<Sidebar snapshot={this.state.selectedSnapshot} />
					: null}
        <Map onClick={this.onClick} liveData={true} />
      </div>
    );
  },

	onClick(event) {
		this.setState({
			selectedSnapshot: event.snapshot
		});
	}
});

export default App;
