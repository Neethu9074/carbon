import metricDefinitions from 'in-forge/plugins/db2Database/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/db2Database/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.db2Database,
  pluginName: {
    singular: 'DB2',
    plural: 'DB2s'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'DB2'
  }
});
