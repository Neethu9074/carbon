import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

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
