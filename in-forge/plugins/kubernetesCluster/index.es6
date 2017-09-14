import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.kubernetesCluster,
  iconSvgPath,
  tableDefinition,
  metricDefinitions,
  isNewDashboard: true,

  pluginName: {
    singular: 'Kubernetes Cluster',
    plural: 'Kubernetes Clusters'
  },

  chartWiggleRoom: 20000
});
