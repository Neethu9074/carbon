import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.redis,
  icon
});

setHumanReadablePluginName(
  plugins.redis,
  'Redis Node',
  'Redis Nodes'
);

addLabelFinder(
  plugins.redis,
  snapshot => 'Redis @' + snapshot.getIn(['data', 'port'])
);

addSearchableEntityType('redis', plugins.redis);
