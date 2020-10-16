import agentMonitoringIssueDefinitions from 'in-forge/plugins/netCoreRuntimePlatform/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/netCoreRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/netCoreRuntimePlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.netCoreRuntimePlatform,
  pluginName: {
    singular: '.NET Core App',
    plural: '.NET Core Apps'
  },
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: '.NET Core'
  }
});
