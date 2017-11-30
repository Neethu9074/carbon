import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

registerSnapshotDefinition({
  plugin: plugins.shellLogicalConnection,

  iconSvgPath,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Shell Connection',
    plural: 'Shell Connections'
  }
});
