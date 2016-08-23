import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/defaultLogicalConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalPdoConnection,
  'Logical PDO Connection',
  'Logical PDO Connections'
);

addLabelFinder(
  constants.plugins.logicalPdoConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

addIconToRegistry({
  id: constants.plugins.logicalPdoConnection,
  image: iconPath
});
