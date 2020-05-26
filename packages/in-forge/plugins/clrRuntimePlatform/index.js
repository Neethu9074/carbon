import agentMonitoringIssueDefinitions from 'in-forge/plugins/clrRuntimePlatform/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/clrRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/clrRuntimePlatform/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/clrRuntimePlatform/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.clrRuntimePlatform,
  pluginName: {
    singular: '.NET App',
    plural: '.NET Apps'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: '.NET'
  }
});
