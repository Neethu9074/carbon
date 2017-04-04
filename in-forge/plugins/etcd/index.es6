import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.etcd,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Etcd Node',
    plural: 'Etcd Nodes'
  },
  namesForTypeSearch: ['etcd']
});
