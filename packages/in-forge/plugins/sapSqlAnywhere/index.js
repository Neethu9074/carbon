import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.sapSqlAnywhere,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'SAP SQL Anywhere Sever',
    plural: 'SAP SQL Anywhere Servers'
  },
  technologyDescriptor: {
    label: 'SAP SQL Anywhere'
  }
});
