import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/azureCosmosDb/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

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
