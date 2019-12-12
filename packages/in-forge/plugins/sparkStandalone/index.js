import metricDefinitions from 'in-forge/plugins/sparkStandalone/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/sparkStandalone/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import iconSvgPath from 'in-forge/plugins/sparkStandalone/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.sparkStandalone,
  pluginName: {
    singular: 'Spark Standalone',
    plural: 'Spark Standalone'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
