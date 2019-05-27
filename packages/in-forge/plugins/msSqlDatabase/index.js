import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.msSqlDatabase,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'MS SQL Instance',
    plural: 'MS SQL Instances'
  },
  technologyDescriptor: {
    label: 'MS SQL'
  }
});
