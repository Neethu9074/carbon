import iconPath from 'in-forge/plugins/msSqlDatabase/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addSearchableEntityType} from 'in-sdk/search';
import {addLabelFinder} from 'in-sdk/snapshot';

pluginName.setHumanReadablePluginName(
  constants.plugins.mssql,
  'MsSQL Instance',
  'MsSQL Instances'
);


addLabelFinder(
  constants.plugins.mssql,
  snapshot => 'MSSQL @' + snapshot.getIn(['data', 'instance'])
);


addIconToRegistry({
  id: constants.plugins.mssql,
  image: iconPath
});

addSearchableEntityType('mssql', constants.plugins.mssql);
