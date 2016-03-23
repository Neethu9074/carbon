import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import * as constants from 'in-forge/constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.mongodb,
  'MongoDB Node',
  'MongoDB Nodes'
);

addLabelFinder(
  constants.plugins.mongodb,
  snapshot => 'MongoDB @' + snapshot.getIn(['data', 'port'])
);

power.addMapping(
  constants.plugins.mongodb,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.mongodb,
  image: iconPath
});
