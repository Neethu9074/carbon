import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.memcached,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Memcached Nodes',
    plural: 'Memcacheds Nodes'
  }
});
