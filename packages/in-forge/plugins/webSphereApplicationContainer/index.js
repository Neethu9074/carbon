import kpiDefinitions from 'in-forge/plugins/webSphereApplicationContainer';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.webSphereApplicationContainer,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'WebSphere',
    plural: 'WebSpheres'
  }
});
