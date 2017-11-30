import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

registerSnapshotDefinition({
  plugin: plugins.javaMailLogicalConnection,

  iconSvgPath,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Java Mail Connection',
    plural: 'Java Mail Connections'
  }
});
