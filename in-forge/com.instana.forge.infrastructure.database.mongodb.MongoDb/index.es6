import {
  addLabelFinder,
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as zones from 'in-sdk/zones';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.mongodb,
  'MongoDB Node',
  'MongoDB Nodes'
);

addLabelFinder(
  constants.plugins.mongodb,
  snapshot => 'MongoDB @' + snapshot.getIn(['data', 'port'])
);

addIconFinder(
  constants.plugins.mongodb,
  () => iconPath
);

zones.addMapping(
  constants.plugins.mongodb,
  snapshot => snapshot.get('hostId')
);

power.addMapping(
  constants.plugins.mongodb,
  () => 1
);
