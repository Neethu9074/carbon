import * as pluginName from 'in-sdk/pluginName';
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

addIconFinder(
  constants.plugins.ec2,
  () => iconPath
);
