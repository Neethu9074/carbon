import {addLabelFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';

import iconPath from 'in-forge/plugins/genericZone/icon.svg';
import * as constants from 'in-forge/constants';

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
