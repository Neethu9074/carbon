import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.javaMailLogicalService,
  iconSvgPath,
  pluginName: {
    singular: 'Java Mail',
    plural: 'Java Mails'
  }
});
