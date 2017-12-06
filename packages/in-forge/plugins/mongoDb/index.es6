import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.mongodb,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'MongoDB Node',
    plural: 'MongoDB Nodes'
  }
});
