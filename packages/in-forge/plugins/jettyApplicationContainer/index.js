import metricDefinitions from 'in-forge/plugins/jettyApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/jettyApplicationContainer/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/jettyApplicationContainer/iconPath';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.jettyApplicationContainer,
  pluginName: {
    singular: 'Jetty',
    plural: 'Jetty'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
