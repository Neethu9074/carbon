import {addLabelFinder, addIconFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.mysql,
  'MySQL DB',
  'MySQL DBs'
);


addLabelFinder(
  constants.plugins.mysql,
  snapshot => 'MySQL @' + snapshot.getIn(['data', 'port'])
);

addIconFinder(
  constants.plugins.mysql,
  () => iconPath
);

power.addMapping(
  constants.plugins.mysql,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.mysql,
  image: iconPath
});
