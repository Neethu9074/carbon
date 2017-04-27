import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.sparkApplication,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Spark Application',
    plural: 'Spark Applications'
  }
});
