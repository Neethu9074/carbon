import iconPath from 'in-forge/plugins/postgreSqlDatabase/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.postgresql,
  'PostgreSQL DB',
  'PostgreSQL DBs'
);

addLabelFinder(
  plugins.postgresql,
  snapshot => 'PostgreSQL @ ' + snapshot.getIn(['data', 'port'])
);

addIconToRegistry({
  id: plugins.postgresql,
  image: iconPath
});


addSearchableEntityType('postgresql', plugins.postgresql);
addSearchableEntityType('postgre', plugins.postgresql);
