import agentMonitoringIssueDefinitions from 'in-forge/plugins/nginx/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/nginx/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/nginx/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/nginx/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.nginx,
  pluginName: {
    singular: 'Nginx Server',
    plural: 'Nginx Servers'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: 'Nginx'
  }
});
