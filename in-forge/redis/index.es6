import {addLabelFinder, addIconFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.redis,
  'Redis Node',
  'Redis Nodes'
);

addLabelFinder(
  constants.plugins.redis,
  snapshot => 'Redis @' + snapshot.getIn(['data', 'port'])
);

addIconFinder(
  constants.plugins.redis,
  () => iconPath
);

power.addMapping(
  constants.plugins.redis,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.redis,
  image: iconPath
});
