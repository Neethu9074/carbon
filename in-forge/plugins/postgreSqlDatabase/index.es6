import iconPath from 'in-forge/plugins/postgreSqlDatabase/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.postgresql,
  'PostgreSQL DB',
  'PostgreSQL DBs'
);

addLabelFinder(
  constants.plugins.postgresql,
  snapshot => 'PostgreSQL @ ' + snapshot.getIn(['data', 'port'])
);

addIconToRegistry({
  id: constants.plugins.postgresql,
  image: iconPath
});


addSearchableEntityType('postgresql', constants.plugins.postgresql);
addSearchableEntityType('postgre', constants.plugins.postgresql);
