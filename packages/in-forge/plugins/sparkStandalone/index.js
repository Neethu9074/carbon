import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { plugins } from 'in-forge/constants';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.sparkStandalone,
  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Spark Standalone',
    plural: 'Spark Standalone'
  }
});
