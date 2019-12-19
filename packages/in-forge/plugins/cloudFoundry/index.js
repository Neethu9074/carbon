import metricDefinitions from 'in-forge/plugins/cloudFoundry/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/cloudFoundry/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/cloudFoundry/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.cloudFoundry,
  pluginName: {
    singular: 'CloudFoundry',
    plural: 'CloudFoundry'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
