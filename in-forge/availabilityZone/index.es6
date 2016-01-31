import {addIconFinder, addLabelFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';

import * as constants from '../constants';

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

addIconToRegistry({
  id: constants.plugins.availabilityZone,
  image: iconPath
});
