import tableDefinition from 'in-forge/plugins/nodeJsRuntimePlatform/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { getCodeView } from 'in-forge/codeView/node';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/nodeJsRuntimePlatform/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.nodeJsRuntimePlatform,

  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Node.js App',
    plural: 'Node.js Apps'
  },
  tableDefinition,
  getCodeView,
  technologyDescriptor: {
    label: 'Node.js'
  }
});
