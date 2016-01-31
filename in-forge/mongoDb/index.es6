import {addLabelFinder, addIconFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
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

addIconFinder(
  constants.plugins.mongodb,
  () => iconPath
);

power.addMapping(
  constants.plugins.mongodb,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.mongodb,
  image: iconPath
});
