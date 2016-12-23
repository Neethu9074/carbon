import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.unmonitoredHost,
  metricDefinitions,
  iconSvgPath,

  getPower() {
    return 1;
  }
});

setHumanReadablePluginName(
  plugins.unmonitoredHost,
  'Unmonitored Host',
  'Unmonitored Hosts'
);

addLabelFinder(plugins.unmonitoredHost, labelFinder);

function labelFinder(snapshot) {
  const ip = snapshot.getIn(['data', 'ipv4']);
  const dnsName = snapshot.getIn(['data', 'dnsName']);

  if (dnsName) {
    return dnsName + ' (' + ip + ')';
  }

  return ip;
}
