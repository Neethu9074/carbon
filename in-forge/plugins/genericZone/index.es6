import { addLabelFinder, registerSnapshotDefinition } from 'in-sdk/snapshot';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.genericZone,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.genericZone, 'Generic Zone', 'Generic Zones');

addLabelFinder(plugins.genericZone, s => s.getIn(['data', 'groupId']));
