import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.ec2,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.ec2, 'EC2 Instance', 'EC2 Instances');

addSearchableEntityType('ec2', plugins.ec2);
addSearchableEntityType('aws', plugins.ec2);
