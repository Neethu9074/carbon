import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

// The legacy AWS Lambda plug-in, replaced by awsLambdaVersion. This plug-in was removed in release 163. We need to keep
// it until the last entity with plugin ID com.instana.forge.hardware.virtual.aws.lambda.AwsLambda has been removed due
// to data retention (that is, it can be deleted approximately November 2020).
registerSnapshotDefinition({
  plugin: plugins.awsLambda,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'AWS Lambda',
    plural: 'AWS Lambdas'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name'], '');
  }
});
