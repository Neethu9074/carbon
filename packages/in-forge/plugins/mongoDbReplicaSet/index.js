import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/mongoDb/iconPath';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/mongoDbReplicaSet/kpiDefinitions';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.mongoDbReplicaSet,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'MongoDB Replica Set',
    plural: 'MongoDB Replica Set'
  }
});
