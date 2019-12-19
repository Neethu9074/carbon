import infrastructureTabSubscript from 'in-forge/plugins/awsLambdaVersion/InfrastructureTabSubscript/InfrastructureTabSubscript';
import metricDefinitions from 'in-forge/plugins/awsLambdaVersion/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsLambdaVersion/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/awsLambdaVersion/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsLambdaVersion,
  pluginName: {
    singular: 'AWS Lambda Version',
    plural: 'AWS Lambda Versions'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'AWS Lambda'
  },
  infrastructureTabSubscript
});
