import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';
import kpiDefinitions from 'in-forge/plugins/awsBeanstalk/kpiDefinitions';

registerSnapshotDefinition({
  plugin: plugins.awsBeanstalk,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'AWS Beanstalk Environment',
    plural: 'AWS Beanstalk Environments'
  }
});
