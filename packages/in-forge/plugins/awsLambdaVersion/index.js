import metricDefinitions from 'in-forge/plugins/awsLambdaVersion/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsLambdaVersion/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsLambdaVersion,
  pluginName: {
    singular: 'AWS Lambda Version',
    plural: 'AWS Lambda Versions'
  },
  kpiDefinitions,
  metricDefinitions,
  supportsInfrastructureTabSubscript: true
});
