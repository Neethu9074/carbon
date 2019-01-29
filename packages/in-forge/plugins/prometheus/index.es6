import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.prometheus,
  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Prometheus App',
    plural: 'Prometheus Apps'
  },
  technologyDescriptor: {
    label: 'Prometheus'
  }
});
