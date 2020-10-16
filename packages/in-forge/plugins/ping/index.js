import metricDefinitions from 'in-forge/plugins/ping/metricDefinitions';
import tableDefinition from 'in-forge/plugins/ping/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/ping/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ping,
  pluginName: {
    singular: 'Ping',
    plural: 'Ping'
  },
  kpiDefinitions,
  metricDefinitions,
  tableDefinition
});
