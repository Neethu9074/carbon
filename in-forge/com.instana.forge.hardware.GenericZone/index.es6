import {addLabelFinder, addIconFinder} from 'in-sdk/snapshot';
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

addIconFinder(
  constants.plugins.genericZone,
  () => iconPath
);

power.addMapping(
  constants.plugins.genericZone,
  () => -1
);
