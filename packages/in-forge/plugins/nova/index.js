import metricDefinitions from 'in-forge/plugins/nova/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/nova/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/nova/iconPath';
import { plugins } from 'in-forge/constants';

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
