import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.jbossdatagrid,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'JBoss Data Grid',
    plural: 'JBoss Data Grids'
  }
});
