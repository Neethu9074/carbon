import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/mongoDb/iconPath';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.mongodbReplicaSet,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'MongoDB Replica Set',
    plural: 'MongoDB Replica Set'
  }
});
