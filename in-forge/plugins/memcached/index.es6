import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.memcached,
  icon
});

setHumanReadablePluginName(
  plugins.memcached,
  'Memcached Node',
  'Memcached Nodes'
);

addLabelFinder(
  plugins.memcached,
  snapshot => 'Memcached @' + snapshot.getIn(['data', 'port'])
);

addSearchableEntityType('memcached', plugins.memcached);
