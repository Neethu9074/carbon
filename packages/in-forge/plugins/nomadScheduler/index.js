import metricDefinitions from 'in-forge/plugins/nomadScheduler/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/nomadScheduler/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/nomadScheduler/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.nomadScheduler,
  pluginName: {
    singular: 'Nomad Client',
    plural: 'Nomad Clients'
  },
  iconSvgPath,
  metricDefinitions,
  kpiDefinitions
});
