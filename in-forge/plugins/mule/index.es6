import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.mule,

  iconSvgPath,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Mule ESB',
    plural: 'Mule ESB'
  }
});
