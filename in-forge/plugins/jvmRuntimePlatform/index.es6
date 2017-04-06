import tableDefinition from 'in-forge/plugins/jvmRuntimePlatform/tableDefinition';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

import './metrics.es6';

registerSnapshotDefinition({
  plugin: plugins.jvm,
  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  tableDefinition,
  pluginName: {
    singular: 'JVM',
    plural: 'JVMs'
  }
});
