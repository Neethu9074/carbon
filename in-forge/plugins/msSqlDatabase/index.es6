import iconPath from 'in-forge/plugins/msSqlDatabase/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addSearchableType} from 'in-sdk/search';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

pluginName.setHumanReadablePluginName(
  constants.plugins.mssql,
  'MsSQL Instance',
  'MsSQL Instances'
);


addLabelFinder(
  constants.plugins.mssql,
  snapshot => 'MSSQL @' + snapshot.getIn(['data', 'instance'])
);

power.addMapping(
  constants.plugins.mssql,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.mssql,
  image: iconPath
});

addSearchableType('mssql', constants.plugins.mssql);
