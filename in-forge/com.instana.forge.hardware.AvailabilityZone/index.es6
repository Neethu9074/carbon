import {addIconFinder, addLabelFinder} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as zones from 'in-sdk/zones';

import * as constants from '../constants';

zones.addMapping(
  constants.plugins.availabilityZone,
  snapshot => snapshot.getIn(['data', 'groupId'])
);

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.availabilityZone,
  'Availability Zone',
  'Availability Zones'
);

addLabelFinder(constants.plugins.availabilityZone, s => s.getIn(['data', 'groupId']));

addIconFinder(
  constants.plugins.availabilityZone,
  () => iconPath
);
