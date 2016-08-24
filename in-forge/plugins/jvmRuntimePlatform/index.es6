import iconPath from 'in-forge/plugins/jvmRuntimePlatform/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addSearchableEntityType} from 'in-sdk/search';
import {addLabelFinder} from 'in-sdk/snapshot';

import './metrics.es6';

setHumanReadablePluginName(
  plugins.jvm,
  'JVM',
  'JVMs'
);

addLabelFinder(
  plugins.jvm,
  snapshot => snapshot.getIn(['data', 'name'], 'Unknown JVM')
);

addIconToRegistry({
  id: plugins.jvm,
  image: iconPath
});

addSearchableEntityType('jvm', plugins.jvm);
addSearchableEntityType('java', plugins.jvm);
