import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';
import iconPath from 'in-forge/plugins/memcached/icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.memcached,
  'Memcached Node',
  'Memcached Nodes'
);

addLabelFinder(
  constants.plugins.memcached,
  snapshot => 'Memcached @' + snapshot.getIn(['data', 'port'])
);

addIconToRegistry({
  id: constants.plugins.memcached,
  image: iconPath
});

addSearchableEntityType('memcached', constants.plugins.memcached);
