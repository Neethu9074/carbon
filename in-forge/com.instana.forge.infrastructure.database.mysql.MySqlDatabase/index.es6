import {
  addLabelFinder,
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as zones from 'in-sdk/zones';
import * as power from 'in-sdk/power';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.mysql,
  'MySQL DB',
  'MySQL DBs'
);


addLabelFinder(
  constants.plugins.mysql,
  snapshot => 'MySQL @' + snapshot.getIn(['data', 'port'])
);

addIconFinder(
  constants.plugins.mysql,
  () => iconPath
);

zones.addMapping(
  constants.plugins.mysql,
  snapshot => snapshot.get('hostId')
);

power.addMapping(
  constants.plugins.mysql,
  () => -1
);
