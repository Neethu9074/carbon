import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

/**
 * A Lambda function is mostly a container for individual versions of that function. The actual meat (metrics, chart and
 * stuff) is in awsLambdaVersion.
 */
registerSnapshotDefinition({
  plugin: plugins.awsLambdaFunction,
  iconSvgPath,

  pluginName: {
    singular: 'AWS Lambda Function',
    plural: 'AWS Lambda Functions'
  }
});
