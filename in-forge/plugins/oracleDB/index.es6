import iconPath from 'in-forge/plugins/oracleDB/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';


setHumanReadablePluginName(
  plugins.oracledb,
  'OracleDB',
  'OracleDB'
);

addLabelFinder(
  plugins.oracledb,
  snapshot => 'OracleDB @' + snapshot.getIn(['data', 'databaseSID'])
);

addIconToRegistry({
  id: plugins.oracledb,
  image: iconPath
});

addSearchableEntityType('oracle', plugins.oracledb);
