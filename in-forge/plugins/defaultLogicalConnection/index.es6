import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/defaultLogicalConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.defaultLogicalConnection,
  'Unspecified Logical Connection',
  'Unspecified Logical Connections'
);

addLabelFinder(
  constants.plugins.defaultLogicalConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

power.addMapping(
  constants.plugins.defaultLogicalConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.defaultLogicalConnection,
  image: iconPath
});
