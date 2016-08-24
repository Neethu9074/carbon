import iconPath from 'in-forge/plugins/msSqlDatabase/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addSearchableEntityType} from 'in-sdk/search';
import {addLabelFinder} from 'in-sdk/snapshot';

setHumanReadablePluginName(
  plugins.mssql,
  'MsSQL Instance',
  'MsSQL Instances'
);


addLabelFinder(
  plugins.mssql,
  snapshot => 'MSSQL @' + snapshot.getIn(['data', 'instance'])
);


addIconToRegistry({
  id: plugins.mssql,
  image: iconPath
});

addSearchableEntityType('mssql', plugins.mssql);
