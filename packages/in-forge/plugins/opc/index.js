import metricDefinitions from 'in-forge/plugins/opc/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/opc/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.opc,
  pluginName: {
    singular: 'Oracle Cloud Instance',
    plural: 'Oracle Cloud Instances'
  },
  kpiDefinitions,
  metricDefinitions
});
