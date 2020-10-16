import agentMonitoringIssueDefinitions from 'in-forge/plugins/clrRuntimePlatform/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/clrRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/clrRuntimePlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.clrRuntimePlatform,
  pluginName: {
    singular: '.NET App',
    plural: '.NET Apps'
  },
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: '.NET'
  }
});
