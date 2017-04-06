import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.msiis,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Internet Information Server',
    plural: 'Internet Information Servers'
  }
});
