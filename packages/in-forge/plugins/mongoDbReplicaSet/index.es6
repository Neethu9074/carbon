import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/mongoDb/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.mongodbReplicaSet,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'MongoDb Replica Set',
    plural: 'MongoDb Replica Set'
  }
});
