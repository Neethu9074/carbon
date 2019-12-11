import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import kpiDefinitions from 'in-forge/plugins/nova';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.nova,
  pluginName: {
    singular: 'OpenStack Compute Instance',
    plural: 'OpenStack Compute Instances'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
