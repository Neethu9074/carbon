import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import tableDefinition from 'in-forge/plugins/jvmRuntimePlatform/tableDefinition';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';
import './metrics.es6';

registerSnapshotDefinition({
  plugin: plugins.jvm,
  icon,
  supportsCodeView,
  getCodeView,
  tableDefinition
});

setHumanReadablePluginName(
  plugins.jvm,
  'JVM',
  'JVMs'
);

addLabelFinder(
  plugins.jvm,
  snapshot => snapshot.getIn(['data', 'name'], 'Unknown JVM')
);

addSearchableEntityType('jvm', plugins.jvm);
addSearchableEntityType('java', plugins.jvm);
