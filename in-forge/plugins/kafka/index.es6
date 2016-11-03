import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.kafka,
  icon,
  metricDefinitions,
  supportsCodeView,
  getCodeView
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
