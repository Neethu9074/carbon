import metricDefinitions from 'in-forge/plugins/jBossAsApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/jBossAsApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import iconSvgPath from 'in-forge/plugins/jbossDataGrid/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.jBossAsApplicationContainer,
  pluginName: {
    singular: 'JBoss',
    plural: 'JBoss'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'JBoss'
  }
});
