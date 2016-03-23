import {addLabelFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/genericHardware/icon.svg';
import * as constants from 'in-forge/constants';

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
