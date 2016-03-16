import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.jbossas,
  'JBoss AS',
  'JBoss AS'
);

addLabelFinder(
  constants.plugins.jbossas,
  snapshot => snapshot.getIn(['data', 'version'])
);

power.addMapping(
  constants.plugins.jbossas,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.jbossas,
  image: iconPath
});
