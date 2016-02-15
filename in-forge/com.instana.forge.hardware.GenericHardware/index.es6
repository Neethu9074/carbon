import {addLabelFinder, addIconFinder} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.genericHardware,
  'Generic Hardware',
  'Generic Hardware'
);

addLabelFinder(
  constants.plugins.genericHardware,
  () => 'Generic Hardware'
);

addIconFinder(
  constants.plugins.genericHardware,
  () => iconPath
);

power.addMapping(
  constants.plugins.genericHardware,
  () => -1
);
