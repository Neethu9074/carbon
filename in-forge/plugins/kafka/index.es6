import iconPath from 'in-forge/plugins/kafka/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.kafka,
  'Kafka',
  'Kafka'
);

addLabelFinder(constants.plugins.kafka, getLabel);

function getLabel(snapshot) {
  return 'Kafka ' + snapshot.getIn(['data', 'version']);
}

addIconToRegistry({
  id: constants.plugins.kafka,
  image: iconPath
});

addSearchableEntityType('kafka', constants.plugins.kafka);
