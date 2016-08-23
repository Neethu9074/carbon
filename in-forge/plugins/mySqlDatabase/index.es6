import iconPath from 'in-forge/plugins/mySqlDatabase/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';


pluginName.setHumanReadablePluginName(
  constants.plugins.mysql,
  'MySQL',
  'MySQL DBs'
);


addLabelFinder(
  constants.plugins.mysql,
  snapshot => 'MySQL @' + snapshot.getIn(['data', 'port'])
);

addIconToRegistry({
  id: constants.plugins.mysql,
  image: iconPath
});

addSearchableEntityType('mysql', constants.plugins.mysql);
