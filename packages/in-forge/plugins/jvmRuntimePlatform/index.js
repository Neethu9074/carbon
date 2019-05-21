import tableDefinition from 'in-forge/plugins/jvmRuntimePlatform/tableDefinition';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

import './metrics.js';

registerSnapshotDefinition({
  plugin: plugins.jvmRuntimePlatform,
  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  tableDefinition,
  pluginName: {
    singular: 'JVM',
    plural: 'JVMs'
  },
  technologyDescriptor: {
    label: 'JVM'
  }
});
