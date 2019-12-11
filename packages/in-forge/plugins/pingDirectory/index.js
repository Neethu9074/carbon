import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import kpiDefinitions from 'in-forge/plugins/pingDirectory';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.pingDirectory,
  iconSvgPath,
  supportsCodeView,
  getCodeView,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'PingIdentity Directory Server',
    plural: 'PingIdentity Directory Servers'
  }
});
