import tableDefinition from 'in-forge/plugins/jvmRuntimePlatform/tableDefinition';
import { addLabelFinder, registerSnapshotDefinition } from 'in-sdk/snapshot';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

import './metrics.es6';

registerSnapshotDefinition({
  plugin: plugins.jvm,

  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  tableDefinition
});

setHumanReadablePluginName(plugins.jvm, 'JVM', 'JVMs');

addLabelFinder(plugins.jvm, snapshot => {
  const appInfo = snapshot.getIn(['data', 'appInfo']);
  if (appInfo) {
    return appInfo.get('title') + ' ' + appInfo.get('version');
  }
  return snapshot.getIn(['data', 'name'], 'Unknown JVM');
});

addSearchableEntityType('jvm', plugins.jvm);
addSearchableEntityType('java', plugins.jvm);
