import * as zones from 'in-sdk/zones';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from '../constants';

zones.addMapping(
  constants.plugins.availabilityZone,
  snapshot => snapshot.getIn(['data', 'groupId'])
);

pluginName.setHumanReadablePluginName(
  constants.plugins.availabilityZone,
  'Availability Zone',
  'Availability Zones'
);

addLabelFinder(constants.plugins.availabilityZone, s => s.getIn(['data', 'groupId']));
