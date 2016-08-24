import iconPath from 'in-forge/plugins/kafka/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.kafka,
  'Kafka',
  'Kafka'
);

addLabelFinder(plugins.kafka, getLabel);

function getLabel(snapshot) {
  return 'Kafka ' + snapshot.getIn(['data', 'version']);
}

addIconToRegistry({
  id: plugins.kafka,
  image: iconPath
});

addSearchableEntityType('kafka', plugins.kafka);
