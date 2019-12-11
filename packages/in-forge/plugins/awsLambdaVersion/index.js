import InfrastructureTabSubscript from './InfrastructureTabSubscript/InfrastructureTabSubscript';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';
import kpiDefinitions from 'in-forge/plugins/awsLambdaVersion/kpiDefinitions';

registerSnapshotDefinition({
  plugin: plugins.awsLambdaVersion,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  pluginName: {
    singular: 'AWS Lambda Version',
    plural: 'AWS Lambda Versions'
  },
  technologyDescriptor: {
    label: 'AWS Lambda'
  },
  infrastructureTabSubscript: InfrastructureTabSubscript
});
