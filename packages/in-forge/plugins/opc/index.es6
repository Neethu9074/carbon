import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.opc,
  pluginName: {
    singular: 'Oracle Cloud Instance',
    plural: 'Oracle Cloud Instances'
  },
  iconSvgPath,
  metricDefinitions
});
