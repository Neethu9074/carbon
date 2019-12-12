import metricDefinitions from 'in-forge/plugins/httpd/metricDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/php';
import kpiDefinitions from 'in-forge/plugins/httpd/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/httpd/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.httpd,
  pluginName: {
    singular: 'Apache HTTPd',
    plural: 'Apache HTTPds'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  supportsCodeView,
  getCodeView
});
