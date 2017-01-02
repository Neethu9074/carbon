import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import iconSvgPath from './iconPath';


registerSnapshotDefinition({
  plugin: plugins.redis,
  iconSvgPath
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
