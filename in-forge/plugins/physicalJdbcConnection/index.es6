import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/physicalJdbcConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.physicalJdbcConnection,
  'Physical Http Connection',
  'Physical Http Connections'
);

addLabelFinder(
  constants.plugins.physicalJdbcConnection,
  snapshot => snapshot.getIn(['data', 'source', 'id']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'id'])
);

power.addMapping(
  constants.plugins.physicalJdbcConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.physicalJdbcConnection,
  image: iconPath
});
