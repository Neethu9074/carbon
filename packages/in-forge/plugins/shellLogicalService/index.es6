import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.shellLogicalService,
  iconSvgPath,
  pluginName: {
    singular: 'Shell Call',
    plural: 'Shell Calls'
  }
});
