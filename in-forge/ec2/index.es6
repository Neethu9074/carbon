import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.ec2,
  'EC2 Instance',
  'EC2 Instances'
);

addIconToRegistry({
  id: constants.plugins.ec2,
  image: iconPath
});
