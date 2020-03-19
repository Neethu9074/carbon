import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import kpiDefinitions from './kpiDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.tibcoEMS,
  iconSvgPath,
  metricDefinitions,
  kpiDefinitions,
  pluginName: {
    singular: 'Tibco EMS',
    plural: 'Tibco EMS'
  },
  technologyDescriptor: {
    label: 'Tibco EMS'
  }
});
