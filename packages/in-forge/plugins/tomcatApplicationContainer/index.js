import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.tomcatApplicationContainer,
  iconSvgPath,
  supportsCodeView,
  getCodeView,
  metricDefinitions,
  pluginName: {
    singular: 'Tomcat',
    plural: 'Tomcats'
  },
  technologyDescriptor: {
    label: 'Tomcat'
  }
});
