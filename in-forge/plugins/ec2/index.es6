import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.ec2,

  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'EC2 Instance',
    plural: 'EC2 Instances'
  }
});
