import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.tomcat,
  iconSvgPath,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Tomcat Server',
    plural: 'Tomcat Servers'
  }
});
