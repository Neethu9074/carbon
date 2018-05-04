import iconSvgPath from 'in-forge/plugins/openshiftDeploymentConfig/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.openshiftDeploymentConfig,
  iconSvgPath,
  pluginName: {
    singular: 'Openshift Deployment Config',
    plural: 'Openshift Deployment Configs'
  }
});
