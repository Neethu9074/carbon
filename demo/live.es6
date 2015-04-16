import React from 'react';
import PieChart from '../src';
import Immutable from 'immutable';
import MultiMetricConveyer from 'instana-ui-services/conveyer/MultiMetricConveyer';
import {create} from 'instana-ui-services/conveyer';

const snapshot = Immutable.fromJS({
	"hostId": "ip-10-86-133-33",
	"steadyId": "Linux.3.14.26-24.46.amzn1.x86_64",
	"pluginId": "com.instana.forge.infrastructure.os.OS",
	"snapshot": {
		"cpu.count": "1",
		"cpu.model": "Intel Xeon 2.5 GHz",
		"memory.total": "3947331584",
		"os.arch": "x86_64",
		"os.name": "Linux",
		"os.version": "3.13.0-44-generic",
		"swap.total": "0"
	}
});

const datasource = create(MultiMetricConveyer, {
  snapshot,
  min: 0,
  max: 1,
  frequency: 5000,
  timeframe: 5000,
  metrics: [
		'cpu.total.user.5000.mean',
		'cpu.total.sys.5000.mean',
		'cpu.total.idle.5000.mean',
		'cpu.total.wait.5000.mean',
		'cpu.total.nice.5000.mean',
		'cpu.total.steal.5000.mean'
	]
});

export default function init() {
  React.render(
    <PieChart width="300" datasource={datasource} />,
    document.body
  );
}
