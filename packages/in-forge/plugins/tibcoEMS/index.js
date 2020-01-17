import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.tibcoEMS,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Tibco EMS',
    plural: 'Tibco EMS'
  },
  technologyDescriptor: {
    label: 'Tibco EMS'
  }
});
