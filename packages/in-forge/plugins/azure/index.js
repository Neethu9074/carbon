import metricDefinitions from 'in-forge/plugins/azure/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azure/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/azure/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azure,
  pluginName: {
    singular: 'Azure Instance',
    plural: 'Azure Instances'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
