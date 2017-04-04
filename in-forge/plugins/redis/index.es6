import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.redis,
  iconSvgPath
});

setHumanReadablePluginName(plugins.redis, 'Redis Node', 'Redis Nodes');

addSearchableEntityType('redis', plugins.redis);
