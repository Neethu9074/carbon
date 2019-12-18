import metricDefinitions from 'in-forge/plugins/azureAppService/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureAppService/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/azureAppService/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

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
