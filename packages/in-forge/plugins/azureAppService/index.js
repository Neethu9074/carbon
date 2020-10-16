import metricDefinitions from 'in-forge/plugins/azureAppService/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureAppService/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureAppService,
  pluginName: {
    singular: 'Azure AppService',
    plural: 'Azure AppService'
  },
  kpiDefinitions,
  metricDefinitions
});
