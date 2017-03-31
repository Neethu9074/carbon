import { addLabelFinder, registerSnapshotDefinition } from 'in-sdk/snapshot';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.process,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.process, 'Process', 'Processes');

addLabelFinder(plugins.process, getLabel);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'exec']);
}
