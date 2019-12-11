import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/availabilityZone/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.availabilityZone,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  pluginName: {
    singular: 'Availability Zone',
    plural: 'Availability Zones'
  }
});
