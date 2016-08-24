import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addSearchableEntityType} from 'in-sdk/search';

import icon from './icon.svg';
import './metrics.es6';

registerSnapshotDefinition({
  plugin: plugins.jvm,
  icon
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
