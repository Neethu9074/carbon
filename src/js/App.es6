'use strict';

import './App.less'

import Immutable from 'immutable';
import React from 'react/react';
import Map from 'instana-ui-map';
import {create} from 'instana-ui-services/conveyer';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';

const snapshot = Immutable.fromJS({
	'hostId': 'ip-10-86-133-33',
	'steadyId': 'Linux.3.14.26-24.46.amzn1.x86_64',
	'pluginId': 'com.instana.forge.infrastructure.os.OS',
	'snapshot': {
		'memory.total': '7882125312',
		'os.arch': 'x86_64',
		'os.name': 'Linux',
		'os.version': '3.14.26-24.46.amzn1.x86_64',
		'swap.total': '0'
	}
});
const conveyer = create(MetricConveyer, {
  snapshot,
  min: 0,
  max: 500,
  frequency: 1000,
  timeframe: 5 * 60 * 1000,
  metric: 'cpu.individual.1.idle.5000.mean'
});

conveyer.subscribe(e => console.log(e.toJS()));

const App = React.createClass({
  render() {
    return (
      <div>
        <Map onClick={alert} />
      </div>
    );
  }
});

export default App;
