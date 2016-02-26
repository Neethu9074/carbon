import {addLabelFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';

import * as constants from '../constants';

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.unmonitoredHost,
  'Unmonitored Host',
  'Unmonitored Hosts'
);

addLabelFinder(constants.plugins.unmonitoredHost, s => {
  return 'Unmonitored Host with IP ' + s.getIn(['data', 'ip']);
});

addIconToRegistry({
  id: constants.plugins.unmonitoredHost,
  image: iconPath
});
