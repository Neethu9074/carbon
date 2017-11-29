import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsSqs,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'AWS SQS',
    plural: 'AWS SQSs'
  }
});
