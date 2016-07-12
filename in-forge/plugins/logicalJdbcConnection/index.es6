import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/logicalJdbcConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalJdbcConnection,
  'Logical Jdbc Connection',
  'Logical Jdbc Connections'
);

addLabelFinder(
  constants.plugins.logicalJdbcConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              '->' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

power.addMapping(
  constants.plugins.logicalJdbcConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.logicalJdbcConnection,
  image: iconPath
});
