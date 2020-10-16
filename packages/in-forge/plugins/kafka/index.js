import agentMonitoringIssueDefinitions from 'in-forge/plugins/kafka/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/kafka/metricDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import kpiDefinitions from 'in-forge/plugins/kafka/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kafka,
  pluginName: {
    singular: 'Kafka Node',
    plural: 'Kafka Nodes'
  },
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  agentMonitoringIssueDefinitions
});
