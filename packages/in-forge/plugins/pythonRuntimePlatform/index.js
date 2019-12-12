import metricDefinitions from 'in-forge/plugins/pythonRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/pythonRuntimePlatform/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/pythonRuntimePlatform/iconPath';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/python';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pythonRuntimePlatform,
  pluginName: {
    singular: 'Python App',
    plural: 'Python Apps'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'Python'
  }
});
