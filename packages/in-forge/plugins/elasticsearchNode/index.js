import metricDefinitions from 'in-forge/plugins/elasticsearchNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/elasticsearchNode/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import iconSvgPath from 'in-forge/plugins/elasticsearchNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.elasticsearchNode,
  pluginName: {
    singular: 'Elasticsearch Node',
    plural: 'Elasticsearch Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
