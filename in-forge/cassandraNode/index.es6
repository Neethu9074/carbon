import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addIconFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.cassandra,
  'Cassandra Node',
  'Cassandra Nodes'
);

addIconFinder(
  constants.plugins.cassandra,
  () => iconPath
);

power.addMapping(
  constants.plugins.cassandra,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.cassandra,
  image: iconPath
});
