import { supportsCodeView, getCodeView } from 'in-forge/codeView/python';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.pythonRuntimePlatform,

  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Python App',
    plural: 'Python Apps'
  },
  technologyDescriptor: {
    label: 'Python'
  }
});
