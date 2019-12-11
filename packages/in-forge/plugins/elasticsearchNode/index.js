import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/elasticsearchNode';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.elasticsearchNode,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Elasticsearch Node',
    plural: 'Elasticsearch Nodes'
  }
});
