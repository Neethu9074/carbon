import { supportsCodeView, getCodeView } from 'in-forge/codeView/php';
import kpiDefinitions from 'in-forge/plugins/phpFpmRuntimePlatform';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.phpFpmRuntimePlatform,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  pluginName: {
    singular: 'PHP-FPM Runtime',
    plural: 'PHP-FPM Runtimes'
  },
  technologyDescriptor: {
    label: 'PHP-FPM'
  }
});
