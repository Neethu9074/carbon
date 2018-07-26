import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.browserLogicalConnection,

  iconSvgPath,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Website Connection',
    plural: 'Website Connections'
  }
});
