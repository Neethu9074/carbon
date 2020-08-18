import kpiDefinitions from 'in-forge/plugins/iBMMQCluster/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/iBMMQCluster/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMMQCluster,
  pluginName: {
    singular: 'IBM MQ Cluster',
    plural: 'IBM MQ Clusters'
  },
  iconSvgPath,
  kpiDefinitions
});
