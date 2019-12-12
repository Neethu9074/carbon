import metricDefinitions from 'in-forge/plugins/webSphereLibertyApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/webSphereLibertyApplicationContainer/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/webSphereLibertyApplicationContainer/iconPath';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.webSphereLibertyApplicationContainer,
  pluginName: {
    singular: 'WebSphere Liberty Server',
    plural: 'WebSphere Liberty Servers'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
