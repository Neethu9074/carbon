import metricDefinitions from 'in-forge/plugins/cassandraNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/cassandraNode/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import iconSvgPath from 'in-forge/plugins/cassandraNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.cassandraNode,
  pluginName: {
    singular: 'Cassandra Node',
    plural: 'Cassandra Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
