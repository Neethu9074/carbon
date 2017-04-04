import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.zookeeper,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'ZooKeeper',
    plural: 'ZooKeepers'
  },

  namesForTypeSearch: ['zookeeper']
});
