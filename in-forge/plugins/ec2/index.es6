import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.ec2,
  icon
});

setHumanReadablePluginName(
  plugins.ec2,
  'EC2 Instance',
  'EC2 Instances'
);

addLabelFinder(
  plugins.ec2,
  snapshot => snapshot.getIn(['data', 'instance-id'])
);

addSearchableEntityType('ec2', plugins.ec2);
addSearchableEntityType('aws', plugins.ec2);
