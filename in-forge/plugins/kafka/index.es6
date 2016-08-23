import iconPath from 'in-forge/plugins/kafka/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import * as constants from 'in-forge/constants';
import * as sorting from 'in-sdk/sorting';

pluginName.setHumanReadablePluginName(
  constants.plugins.kafka,
  'Kafka',
  'Kafka'
);

addLabelFinder(constants.plugins.kafka, getLabel);

sorting.addMapping(
  constants.plugins.kafka,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

function getLabel(snapshot) {
  return 'Kafka ' + snapshot.getIn(['data', 'version']);
}

addIconToRegistry({
  id: constants.plugins.kafka,
  image: iconPath
});

addSearchableEntityType('kafka', constants.plugins.kafka);
