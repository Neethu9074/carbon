import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsBeanstalk,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'AWS Beanstalk Environment',
    plural: 'AWS Beanstalk Environments'
  }
});
