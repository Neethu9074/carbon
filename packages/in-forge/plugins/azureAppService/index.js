import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/azureAppService/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.azureAppService,
  pluginName: {
    singular: 'Azure AppService',
    plural: 'Azure AppService'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
