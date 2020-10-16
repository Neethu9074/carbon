import metricDefinitions from 'in-forge/plugins/mongoDb/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/mongoDb/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.mongoDb,
  pluginName: {
    singular: 'MongoDB Node',
    plural: 'MongoDB Nodes'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'MongoDB'
  }
});
