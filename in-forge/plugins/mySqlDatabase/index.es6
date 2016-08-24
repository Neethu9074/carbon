import iconPath from 'in-forge/plugins/mySqlDatabase/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';


setHumanReadablePluginName(
  plugins.mysql,
  'MySQL',
  'MySQL DBs'
);


addLabelFinder(
  plugins.mysql,
  snapshot => 'MySQL @' + snapshot.getIn(['data', 'port'])
);

addIconToRegistry({
  id: plugins.mysql,
  image: iconPath
});

addSearchableEntityType('mysql', plugins.mysql);
