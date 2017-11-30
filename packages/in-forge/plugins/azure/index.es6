import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.azure,
  pluginName: {
    singular: 'Azure Instance',
    plural: 'Azure Instances'
  },
  iconSvgPath,
  metricDefinitions
});
