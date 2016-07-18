import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/physicalHttpConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.physicalHttpConnection,
  'Physical Http Connection',
  'Physical Http Connections'
);

addLabelFinder(
  constants.plugins.physicalHttpConnection,
  snapshot => snapshot.getIn(['data', 'source', 'id']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'id'])
);

power.addMapping(
  constants.plugins.physicalHttpConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.physicalHttpConnection,
  image: iconPath
});
