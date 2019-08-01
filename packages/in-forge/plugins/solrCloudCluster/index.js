import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/solr/iconPath';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.solrCloudCluster,
  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Solr Cloud Cluster',
    plural: 'Solr Cloud Clusters'
  }
});
