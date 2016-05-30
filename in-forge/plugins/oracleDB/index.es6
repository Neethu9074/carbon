import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/oracleDB/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.oracledb,
  'OracleDB',
  'OracleDB'
);

addLabelFinder(
  constants.plugins.oracledb,
  snapshot => 'OracleDB @' + snapshot.getIn(['data', 'databaseSID'])
);

power.addMapping(
  constants.plugins.oracledb,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.oracledb,
  image: iconPath
});
