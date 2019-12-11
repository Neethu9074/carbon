import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/jBossAsApplicationContainer/kpiDefinitions';

import iconSvgPath from 'in-forge/plugins/jbossDataGrid/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.jBossAsApplicationContainer,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'JBoss',
    plural: 'JBoss'
  },
  technologyDescriptor: {
    label: 'JBoss'
  }
});
