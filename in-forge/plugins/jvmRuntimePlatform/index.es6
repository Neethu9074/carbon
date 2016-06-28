import iconPath from 'in-forge/plugins/jvmRuntimePlatform/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addSearchableType} from 'in-sdk/search';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import './metrics.es6';

pluginName.setHumanReadablePluginName(
  constants.plugins.jvm,
  'JVM',
  'JVMs'
);

addLabelFinder(
  constants.plugins.jvm,
  snapshot => snapshot.getIn(['data', 'name'], 'Unknown JVM')
);

power.addMapping(
  constants.plugins.jvm,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.jvm,
  image: iconPath
});

addSearchableType('jvm', constants.plugins.jvm);
addSearchableType('java', constants.plugins.jvm);
