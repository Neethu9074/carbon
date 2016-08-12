import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import * as constants from 'in-forge/constants';
import iconPath from 'in-forge/plugins/redis/icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.redis,
  'Redis Node',
  'Redis Nodes'
);

addLabelFinder(
  constants.plugins.redis,
  snapshot => 'Redis @' + snapshot.getIn(['data', 'port'])
);

power.addMapping(
  constants.plugins.redis,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.redis,
  image: iconPath
});

addSearchableEntityType('redis', constants.plugins.redis);
