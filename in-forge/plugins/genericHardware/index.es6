import {addLabelFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';

import iconPath from 'in-forge/plugins/genericHardware/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.genericHardware,
  'Generic Hardware',
  'Generic Hardware'
);

addLabelFinder(
  plugins.genericHardware,
  () => 'Generic Hardware'
);

addIconToRegistry({
  id: plugins.genericHardware,
  image: iconPath
});
