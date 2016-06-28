import {addIconToRegistry} from 'in-sdk/iconRegistry';
import iconPath from 'in-forge/plugins/ec2/icon.svg';
import {addSearchableType} from 'in-sdk/search';
import * as constants from 'in-forge/constants';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';


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

addSearchableType('ec2', constants.plugins.ec2);
addSearchableType('aws', constants.plugins.ec2);
