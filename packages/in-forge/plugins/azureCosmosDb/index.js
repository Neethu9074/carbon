import metricDefinitions from 'in-forge/plugins/azureCosmosDb/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureCosmosDb/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/azureCosmosDb/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureCosmosDb,
  pluginName: {
    singular: 'Azure CosmosDb',
    plural: 'Azure CosmosDb'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
