import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/finagleApplicationContainer/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.finagleApplicationContainer,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Finagle App',
    plural: 'Finagle Apps'
  }
});
