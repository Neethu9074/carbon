import {addLabelFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.genericZone,
  'Generic Zone',
  'Generic Zones'
);

addLabelFinder(
  constants.plugins.genericZone,
  s => s.getIn(['data', 'groupId'])
);

addIconToRegistry({
  id: constants.plugins.genericZone,
  image: iconPath
});

power.addMapping(
  constants.plugins.genericZone,
  () => -1
);
