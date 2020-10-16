import metricDefinitions from 'in-forge/plugins/finagleApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/finagleApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.finagleApplicationContainer,
  pluginName: {
    singular: 'Finagle App',
    plural: 'Finagle Apps'
  },
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
