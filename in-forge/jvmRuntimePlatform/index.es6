import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

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
