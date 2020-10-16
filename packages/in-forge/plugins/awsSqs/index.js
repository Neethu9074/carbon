import metricDefinitions from 'in-forge/plugins/awsSqs/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsSqs/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsSqs,
  pluginName: {
    singular: 'AWS SQS',
    plural: 'AWS SQSs'
  },
  technologyDescriptor: {
    label: 'AWS SQS'
  },
  kpiDefinitions,
  metricDefinitions
});
