import * as ro from 'reactive-observables';

import {addLabelFinder, addIconFinder} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.kafka,
  'Kafka',
  'Kafka'
);

addLabelFinder(constants.plugins.kafka, getLabel);

addIconFinder(
  constants.plugins.kafka,
  () => iconPath
);

power.addMapping(
  constants.plugins.kafka,
  () => -1
);

sorting.addMapping(
  constants.plugins.kafka,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

function getLabel(snapshot) {
  return 'Kafka ' + snapshot.getIn(['data', 'version']);
}
