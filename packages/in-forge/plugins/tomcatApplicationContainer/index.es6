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
    singular: 'Tomcat',
    plural: 'Tomcats'
  },
  technologyDescriptor: {
    label: 'Tomcat'
  }
});
