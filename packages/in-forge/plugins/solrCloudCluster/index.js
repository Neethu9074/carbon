import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import kpiDefinitions from 'in-forge/plugins/solrCloudCluster';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/solr/iconPath';
import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.solrCloudCluster,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Solr Cloud Cluster',
    plural: 'Solr Cloud Clusters'
  }
});
