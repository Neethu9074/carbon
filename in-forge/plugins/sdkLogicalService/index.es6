import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.sdkLogicalService,

  iconSvgPath,
  metricDefinitions,
  namesForTypeSearch: ['service'],
  tableDefinition,

  pluginName: {
    singular: 'Custom Service',
    plural: 'Custom Services'
  },

  chartWiggleRoom: 20000
});
