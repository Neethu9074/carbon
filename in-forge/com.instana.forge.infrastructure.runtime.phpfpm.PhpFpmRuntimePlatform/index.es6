import {addIconFinder, addLabelFinder} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.phpfpm,
  'PHP-FPM Runtime',
  'PHP-FPM Runtimes'
);

addLabelFinder(constants.plugins.phpfpm, getLabel);

function getLabel(s) {
  const data = s.get('data');
  const workerPoolName = data.getIn(['pool']);
  if (!workerPoolName) {
    return getFallbackLabel(s);
  }

  return 'PHP-FPM Worker Pool: ' + workerPoolName;
}

function getFallbackLabel(s) {
  return 'PHP-FPM Worker Pool#' + s.get('steadyId');
}

addIconFinder(
  constants.plugins.phpfpm,
  () => iconPath
);

power.addMapping(
  constants.plugins.phpfpm,
  () => -1
);

sorting.addMapping(
  constants.plugins.phpfpm,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);
