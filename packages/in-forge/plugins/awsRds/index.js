import metricDefinitions from 'in-forge/plugins/awsRds/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsRds/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsRds,
  pluginName: {
    singular: 'AWS RDS',
    plural: 'AWS RDSs'
  },
  technologyDescriptor: {
    label: 'AWS RDS'
  },
  kpiDefinitions,
  metricDefinitions
});
