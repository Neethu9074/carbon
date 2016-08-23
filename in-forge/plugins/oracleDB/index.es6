import iconPath from 'in-forge/plugins/oracleDB/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';


pluginName.setHumanReadablePluginName(
  constants.plugins.oracledb,
  'OracleDB',
  'OracleDB'
);

addLabelFinder(
  constants.plugins.oracledb,
  snapshot => 'OracleDB @' + snapshot.getIn(['data', 'databaseSID'])
);

addIconToRegistry({
  id: constants.plugins.oracledb,
  image: iconPath
});

addSearchableEntityType('oracle', constants.plugins.oracledb);
