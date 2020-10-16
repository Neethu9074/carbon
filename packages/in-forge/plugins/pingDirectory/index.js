import metricDefinitions from 'in-forge/plugins/pingDirectory/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/pingDirectory/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pingDirectory,
  pluginName: {
    singular: 'PingIdentity Directory Server',
    plural: 'PingIdentity Directory Servers'
  },
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
