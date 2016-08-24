import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import {plugins} from 'in-forge/constants';
import iconPath from 'in-forge/plugins/redis/icon.svg';

setHumanReadablePluginName(
  plugins.redis,
  'Redis Node',
  'Redis Nodes'
);

addLabelFinder(
  plugins.redis,
  snapshot => 'Redis @' + snapshot.getIn(['data', 'port'])
);

addIconToRegistry({
  id: plugins.redis,
  image: iconPath
});

addSearchableEntityType('redis', plugins.redis);
