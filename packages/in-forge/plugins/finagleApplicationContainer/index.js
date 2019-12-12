import metricDefinitions from 'in-forge/plugins/finagleApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/finagleApplicationContainer/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/finagleApplicationContainer/iconPath';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.finagleApplicationContainer,
  pluginName: {
    singular: 'Finagle App',
    plural: 'Finagle Apps'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
