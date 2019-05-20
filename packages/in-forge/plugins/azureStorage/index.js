import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.azureStorage,
  pluginName: {
    singular: 'Azure Storage Service',
    plural: 'Azure Storage Services'
  },
  iconSvgPath,
  metricDefinitions
});
