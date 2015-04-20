'use strict';

import './App.less';

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
		const selectedSnapshot = this.state.selectedSnapshot;
    return (
      <div>
				{selectedSnapshot ?
					<Sidebar steadyId={selectedSnapshot.get('steadyId')}
                   hostId={selectedSnapshot.get('hostId')}
                   pluginId={selectedSnapshot.get('pluginId')} />
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
