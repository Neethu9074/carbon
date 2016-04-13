import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';
import iconPath from 'in-forge/plugins/ec2/icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.ec2,
  'EC2 Instance',
  'EC2 Instances'
);

addIconToRegistry({
  id: constants.plugins.ec2,
  image: iconPath
});

addLabelFinder(
  constants.plugins.ec2,
  snapshot => snapshot.getIn(['data', 'instance-id'])
);
