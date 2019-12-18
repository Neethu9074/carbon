import metricDefinitions from 'in-forge/plugins/webSphereApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/webSphereApplicationContainer/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/webSphereApplicationContainer/iconPath';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.webSphereApplicationContainer,
  pluginName: {
    singular: 'WebSphere',
    plural: 'WebSpheres'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
