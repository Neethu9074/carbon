import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/dummyMysqlDb/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.dummyMysqlDb,
  'MySQL DB',
  'MySQL DBs'
);

addLabelFinder(
  constants.plugins.dummyMysqlDb,
  snapshot => snapshot.getIn(['data', 'label'])
);

power.addMapping(
  constants.plugins.dummyMysqlDb,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.dummyMysqlDb,
  image: iconPath
});
