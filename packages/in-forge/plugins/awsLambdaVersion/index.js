import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsLambdaVersion,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'AWS Lambda Version',
    plural: 'AWS Lambda Versions'
  }
});
