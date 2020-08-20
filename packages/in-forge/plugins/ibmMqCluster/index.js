import kpiDefinitions from 'in-forge/plugins/ibmMqCluster/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/ibmMqCluster/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmMqCluster,
  pluginName: {
    singular: 'IBM MQ Cluster',
    plural: 'IBM MQ Clusters'
  },
  iconSvgPath,
  kpiDefinitions
});
