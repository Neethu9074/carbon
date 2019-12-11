import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/cloudFoundry/kpiDefinitions';

import iconSvgPath from 'in-forge/plugins/cloudFoundry/iconPath';
import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.cloudFoundry,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'CloudFoundry',
    plural: 'CloudFoundry'
  }
});
