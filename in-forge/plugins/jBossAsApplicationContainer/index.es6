import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/jbossDataGrid/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.jbossas,

  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView
});

setHumanReadablePluginName(plugins.jbossas, 'JBoss AS', 'JBoss AS');

addSearchableEntityType('jboss', plugins.jbossas);
