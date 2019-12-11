import iconSvgPath from 'in-forge/plugins/openshiftDeploymentConfig/iconPath';
import kpiDefinitions from 'in-forge/plugins/openshiftDeploymentConfig';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.openshiftDeploymentConfig,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Openshift Deployment Config',
    plural: 'Openshift Deployment Configs'
  }
});
