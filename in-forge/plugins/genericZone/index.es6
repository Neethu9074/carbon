import {addLabelFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';

import iconPath from 'in-forge/plugins/genericZone/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.genericZone,
  'Generic Zone',
  'Generic Zones'
);

addLabelFinder(
  plugins.genericZone,
  s => s.getIn(['data', 'groupId'])
);

addIconToRegistry({
  id: plugins.genericZone,
  image: iconPath
});
