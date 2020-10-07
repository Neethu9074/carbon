import agentMonitoringIssueDefinitions from 'in-forge/plugins/kubernetesCluster/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/kubernetesCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesCluster/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/kubernetesCluster/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesCluster,
  pluginName: {
    singular: 'Kubernetes Cluster',
    plural: 'Kubernetes Clusters'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions
});
