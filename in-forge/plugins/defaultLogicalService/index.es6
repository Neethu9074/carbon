import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.defaultLogicalService,
  iconSvgPath,
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'Service',
    plural: 'Services'
  },

  chartWiggleRoom: 20000
});
