import metricDefinitions from 'in-forge/plugins/phpFpmRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/phpFpmRuntimePlatform/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/phpFpmRuntimePlatform/iconPath';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/php';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.phpFpmRuntimePlatform,
  pluginName: {
    singular: 'PHP-FPM Runtime',
    plural: 'PHP-FPM Runtimes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  technologyDescriptor: {
    label: 'PHP-FPM'
  }
});
