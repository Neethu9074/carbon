import iconPath from 'in-forge/plugins/jvmRuntimePlatform/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addSearchableEntityType} from 'in-sdk/search';
import {addLabelFinder} from 'in-sdk/snapshot';

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

addIconToRegistry({
  id: constants.plugins.jvm,
  image: iconPath
});

addSearchableEntityType('jvm', constants.plugins.jvm);
addSearchableEntityType('java', constants.plugins.jvm);
