import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { newServiceDashboardsEnabled } from 'in-services/featureFlags';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.logicalWebApp,

  iconSvgPath,
  tableDefinition,
  metricDefinitions,
  isNewDashboard: newServiceDashboardsEnabled,

  pluginName: {
    singular: 'Web Service',
    plural: 'Web Services'
  },

  chartWiggleRoom: 20000
});
