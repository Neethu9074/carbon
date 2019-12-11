import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/httpd/kpiDefinitions';

import { supportsCodeView, getCodeView } from 'in-forge/codeView/php';
import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.httpd,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  pluginName: {
    singular: 'Apache HTTPd',
    plural: 'Apache HTTPds'
  }
});
