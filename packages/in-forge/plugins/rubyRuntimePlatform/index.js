import metricDefinitions from 'in-forge/plugins/rubyRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/rubyRuntimePlatform/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/rubyRuntimePlatform/iconPath';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/ruby';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.rubyRuntimePlatform,
  pluginName: {
    singular: 'Ruby App',
    plural: 'Ruby Apps'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'Ruby'
  }
});
