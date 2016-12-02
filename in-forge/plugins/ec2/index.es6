import {addKeywordOperator, addSearchableEntityType} from 'in-sdk/search';
import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.ec2,
  icon,
  metricDefinitions
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

addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'ec2Zone',
  field: 'ec2Zone'
});
