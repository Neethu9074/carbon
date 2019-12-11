import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/azureApiManagement/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

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
