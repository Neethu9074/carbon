import metricDefinitions from 'in-forge/plugins/solrCloudCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/solrCloudCluster/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/solr/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.solrCloudCluster,
  pluginName: {
    singular: 'Solr Cloud Cluster',
    plural: 'Solr Cloud Clusters'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
