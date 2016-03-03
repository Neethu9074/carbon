import {addLabelFinder, addLongLabelFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import * as constants from '../constants';

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.unmonitoredHost,
  'Unmonitored Host',
  'Unmonitored Hosts'
);

addLabelFinder(constants.plugins.unmonitoredHost, labelFinder);
addLongLabelFinder(constants.plugins.unmonitoredHost, labelFinder);

addIconToRegistry({
  id: constants.plugins.unmonitoredHost,
  image: iconPath
});

power.addMapping(constants.plugins.unmonitoredHost, () => 1);

function labelFinder(snapshot) {
  const ip = snapshot.getIn(['data', 'ipv4']);
  const dnsName = snapshot.getIn(['data', 'dnsName']);

  if (dnsName) {
    return dnsName + ' (' + ip + ')';
  }

  return ip;
}
