import metricDefinitions from 'in-forge/plugins/openshiftDeploymentConfig/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/openshiftDeploymentConfig/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.openshiftDeploymentConfig,
  pluginName: {
    singular: 'Openshift Deployment Config',
    plural: 'Openshift Deployment Configs'
  },
  kpiDefinitions,
  metricDefinitions
});
