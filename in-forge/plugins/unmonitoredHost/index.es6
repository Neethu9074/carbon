import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import iconPath from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.unmonitoredHost,

  getPower() {
    return 1;
  }
});

pluginName.setHumanReadablePluginName(
  plugins.unmonitoredHost,
  'Unmonitored Host',
  'Unmonitored Hosts'
);

addLabelFinder(plugins.unmonitoredHost, labelFinder);

addIconToRegistry({
  id: plugins.unmonitoredHost,
  image: iconPath
});

function labelFinder(snapshot) {
  const ip = snapshot.getIn(['data', 'ipv4']);
  const dnsName = snapshot.getIn(['data', 'dnsName']);

  if (dnsName) {
    return dnsName + ' (' + ip + ')';
  }

  return ip;
}
