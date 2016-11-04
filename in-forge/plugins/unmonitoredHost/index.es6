import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {plugins} from 'in-forge/constants';

import icon from 'in-sdk/unknown_icon.svg';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.unmonitoredHost,
  metricDefinitions,

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

addIconToRegistry({
  id: plugins.unmonitoredHost,
  image: icon
});

function labelFinder(snapshot) {
  const ip = snapshot.getIn(['data', 'ipv4']);
  const dnsName = snapshot.getIn(['data', 'dnsName']);

  if (dnsName) {
    return dnsName + ' (' + ip + ')';
  }

  return ip;
}
