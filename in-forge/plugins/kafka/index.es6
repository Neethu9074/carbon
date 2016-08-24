import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';
registerSnapshotDefinition({
  plugin: plugins.kafka,
  icon
});

setHumanReadablePluginName(
  plugins.kafka,
  'Kafka',
  'Kafka'
);

addLabelFinder(plugins.kafka, getLabel);

function getLabel(snapshot) {
  return 'Kafka ' + snapshot.getIn(['data', 'version']);
}

addSearchableEntityType('kafka', plugins.kafka);
