import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/postgreSqlDatabase/icon.svg';
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

power.addMapping(
  constants.plugins.postgresql,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.postgresql,
  image: iconPath
});
