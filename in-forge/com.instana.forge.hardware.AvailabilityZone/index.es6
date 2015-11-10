import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.availabilityZone,
  'Availability Zone',
  'Availability Zones'
);

addLabelFinder(constants.plugins.availabilityZone, s => s.getIn(['data', 'groupId']));
