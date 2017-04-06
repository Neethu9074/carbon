import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/jbossDataGrid/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.jbossas,
  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'JBoss AS',
    plural: 'JBoss AS'
  }
});
