import metricDefinitions from 'in-forge/plugins/kubernetesDeployment/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesDeployment/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesDeployment,
  pluginName: {
    singular: 'Kubernetes Deployment',
    plural: 'Kubernetes Deployments'
  },
  kpiDefinitions,
  metricDefinitions
});
