import iconPath from 'in-forge/plugins/phpFpmRuntimePlatform/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as sorting from 'in-sdk/sorting';


pluginName.setHumanReadablePluginName(
  constants.plugins.phpfpm,
  'PHP-FPM Runtime',
  'PHP-FPM Runtimes'
);

addLabelFinder(constants.plugins.phpfpm, getLabel);

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

sorting.addMapping(
  constants.plugins.phpfpm,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

addIconToRegistry({
  id: constants.plugins.phpfpm,
  image: iconPath
});

addSearchableEntityType('php', constants.plugins.phpfpm);
