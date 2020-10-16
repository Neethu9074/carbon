import metricDefinitions from 'in-forge/plugins/cassandraNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/cassandraNode/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.cassandraNode,
  pluginName: {
    singular: 'Cassandra Node',
    plural: 'Cassandra Nodes'
  },
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
