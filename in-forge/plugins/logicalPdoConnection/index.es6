import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

registerSnapshotDefinition({
  plugin: plugins.logicalPdoConnection,

  iconSvgPath,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'PDO Connection',
    plural: 'PDO Connections'
  }
});
