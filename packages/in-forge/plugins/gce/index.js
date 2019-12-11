import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/gce/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.gce,
  pluginName: {
    singular: 'GCE Instance',
    plural: 'GCE Instances'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
