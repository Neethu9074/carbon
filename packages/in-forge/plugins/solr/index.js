import metricDefinitions from 'in-forge/plugins/solr/metricDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import kpiDefinitions from 'in-forge/plugins/solr/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.solr,
  pluginName: {
    singular: 'Solr Node',
    plural: 'Solr Nodes'
  },
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'Solr'
  }
});
