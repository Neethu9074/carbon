import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';
import kpiDefinitions from 'in-forge/plugins/awsLambdaFunction/kpiDefinitions';

/**
 * A Lambda function is mostly a container for individual versions of that function. The actual meat (metrics, chart and
 * stuff) is in awsLambdaVersion.
 */
registerSnapshotDefinition({
  plugin: plugins.awsLambdaFunction,
  iconSvgPath,
  kpiDefinitions,

  pluginName: {
    singular: 'AWS Lambda Function',
    plural: 'AWS Lambda Functions'
  }
});
