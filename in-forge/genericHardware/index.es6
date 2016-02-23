import {addLabelFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
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

addIconToRegistry({
  id: constants.plugins.genericHardware,
  image: iconPath
});


power.addMapping(
  constants.plugins.genericHardware,
  () => -1
);
