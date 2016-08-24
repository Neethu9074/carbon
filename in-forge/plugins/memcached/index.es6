import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import {plugins} from 'in-forge/constants';
import iconPath from 'in-forge/plugins/memcached/icon.svg';

setHumanReadablePluginName(
  plugins.memcached,
  'Memcached Node',
  'Memcached Nodes'
);

addLabelFinder(
  plugins.memcached,
  snapshot => 'Memcached @' + snapshot.getIn(['data', 'port'])
);

addIconToRegistry({
  id: plugins.memcached,
  image: iconPath
});

addSearchableEntityType('memcached', plugins.memcached);
