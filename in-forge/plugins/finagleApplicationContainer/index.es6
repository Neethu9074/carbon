import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import tableDefinition from './tableDefinition';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.finagle,
  iconSvgPath,
  metricDefinitions,
  tableDefinition,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Finagle App',
    plural: 'Finagle Apps'
  }
});
