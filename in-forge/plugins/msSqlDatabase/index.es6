import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.mssql,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'MsSQL Instance',
    plural: 'MsSQL Instances'
  }
});
