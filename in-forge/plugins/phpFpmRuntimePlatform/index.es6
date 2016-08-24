import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.phpfpm,
  icon
});

setHumanReadablePluginName(
  plugins.phpfpm,
  'PHP-FPM Runtime',
  'PHP-FPM Runtimes'
);

addLabelFinder(plugins.phpfpm, getLabel);

function getLabel(s) {
  const data = s.get('data');
  const workerPoolNames = data.getIn(['worker_pools']);
  if (!workerPoolNames) {
    return getFallbackLabel(s);
  }

  return 'PHP-FPM Worker Pools: ' + workerPoolNames.join(', ');
}

function getFallbackLabel(s) {
  return 'PHP-FPM Master Process#' + s.get('steadyId');
}

addSearchableEntityType('php', plugins.phpfpm);
