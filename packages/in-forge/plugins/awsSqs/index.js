import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/awsSqs/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsSqs,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  pluginName: {
    singular: 'AWS SQS',
    plural: 'AWS SQSs'
  }
});
