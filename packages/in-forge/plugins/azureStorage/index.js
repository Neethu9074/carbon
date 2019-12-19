import metricDefinitions from 'in-forge/plugins/azureStorage/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureStorage/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/azureStorage/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureStorage,
  pluginName: {
    singular: 'Azure Storage Service',
    plural: 'Azure Storage Services'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
