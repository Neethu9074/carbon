import {addIconToRegistry} from 'in-sdk/iconRegistry';
import iconPath from 'in-forge/plugins/ec2/icon.svg';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';


setHumanReadablePluginName(
  plugins.ec2,
  'EC2 Instance',
  'EC2 Instances'
);

addIconToRegistry({
  id: plugins.ec2,
  image: iconPath
});

addLabelFinder(
  plugins.ec2,
  snapshot => snapshot.getIn(['data', 'instance-id'])
);

addSearchableEntityType('ec2', plugins.ec2);
addSearchableEntityType('aws', plugins.ec2);
