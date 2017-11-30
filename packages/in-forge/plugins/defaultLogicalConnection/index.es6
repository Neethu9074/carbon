import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.defaultLogicalConnection,

  iconSvgPath,
  metricDefinitions,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Unspecified Logical Connection',
    plural: 'Unspecified Logical Connections'
  }
});
