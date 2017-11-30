import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.logicalRpcConnection,

  iconSvgPath,
  metricDefinitions,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'RPC Connection',
    plural: 'RPC Connections'
  }
});
