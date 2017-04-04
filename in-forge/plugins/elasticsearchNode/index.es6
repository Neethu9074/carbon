import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.elasticsearch,

  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView
});

setHumanReadablePluginName(plugins.elasticsearch, 'Elasticsearch Node', 'Elasticsearch Nodes');

addSearchableEntityType('elastic', plugins.elasticsearch);
addSearchableEntityType('elasticsearch', plugins.elasticsearch);
