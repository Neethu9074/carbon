import metricDefinitions from 'in-forge/plugins/webLogicApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/webLogicApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.webLogicApplicationContainer,
  pluginName: {
    singular: 'WebLogic Server',
    plural: 'WebLogic Servers'
  },
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
