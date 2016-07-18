import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/logicalHttpConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalHttpConnection,
  'Logical Http Connection',
  'Logical Http Connections'
);

addLabelFinder(
  constants.plugins.logicalHttpConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

power.addMapping(
  constants.plugins.logicalHttpConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.logicalHttpConnection,
  image: iconPath
});
