import metricDefinitions from 'in-forge/plugins/availabilityZone/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/availabilityZone/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.availabilityZone,
  pluginName: {
    singular: 'Availability Zone',
    plural: 'Availability Zones'
  },
  kpiDefinitions,
  metricDefinitions
});
