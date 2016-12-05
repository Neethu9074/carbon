import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addKeywordOperator} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.genericZone,
  icon,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.genericZone,
  'Generic Zone',
  'Generic Zones'
);

addLabelFinder(
  plugins.genericZone,
  s => s.getIn(['data', 'groupId'])
);

addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'zone',
  field: 'zone'
});
