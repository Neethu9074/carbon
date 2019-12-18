import metricDefinitions from 'in-forge/plugins/azureApiManagement/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureApiManagement/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/azureApiManagement/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureApiManagement,
  pluginName: {
    singular: 'Azure API Management Service',
    plural: 'Azure API Management Services'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
