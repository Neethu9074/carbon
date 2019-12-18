import metricDefinitions from 'in-forge/plugins/prometheus/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/prometheus/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import iconSvgPath from 'in-forge/plugins/prometheus/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.prometheus,
  pluginName: {
    singular: 'Prometheus App',
    plural: 'Prometheus Apps'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'Prometheus'
  }
});
