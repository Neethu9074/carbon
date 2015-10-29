import * as pluginName from 'in-sdk/pluginName';
import * as zones from 'in-sdk/zones';
import {
  addIconFinder
} from 'in-sdk/snapshot';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.ec2,
  'EC2 Instance',
  'EC2 Instances'
);

zones.addMapping(
  constants.plugins.ec2,
  snapshot => {
    return snapshot.getIn(['data', 'availability-zone']);
  }
);

addIconFinder(
  constants.plugins.ec2,
  () => iconPath
);
