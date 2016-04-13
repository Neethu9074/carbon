import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/mySqlDatabase/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.mysql,
  'MySQL DB',
  'MySQL DBs'
);


addLabelFinder(
  constants.plugins.mysql,
  snapshot => 'MySQL @' + snapshot.getIn(['data', 'port'])
);

power.addMapping(
  constants.plugins.mysql,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.mysql,
  image: iconPath
});
