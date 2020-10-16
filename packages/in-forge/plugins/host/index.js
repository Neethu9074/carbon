import { LoggingIntegrationButtonsRenderer, getObservables } from 'in-integrations/logging/LoggingIntegrationButtons';
import agentMonitoringIssueDefinitions from 'in-forge/plugins/host/agentMonitoringIssueDefinitions';
import getKubernetesNodeByHost from 'in-subscription/kubernetes/getKubernetesNodeByHost';
import metricDefinitions from 'in-forge/plugins/host/metricDefinitions';
import tableDefinition from 'in-forge/plugins/host/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/host/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import 'in-forge/plugins/host/metrics';

registerSnapshotDefinition({
  plugin: plugins.host,
  pluginName: {
    singular: 'Host',
    plural: 'Hosts'
  },
  showZoneInSidebarHeader: true,
  tableDefinition,
  kpiDefinitions,
  agentMonitoringIssueDefinitions,
  metricDefinitions,

  getPower(snapshot) {
    const data = snapshot.get('data');
    return data.get('memory.total', 1) * data.get('cpu.count', 1);
  },

  getDashboardHeaderActions({ snapshot, timeConfig }) {
    const hostFqdn = snapshot.getIn(['data', 'fqdn']);
    const hostName = snapshot.getIn(['data', 'hostname']);

    return [
      {
        getObservables: props => ({
          ...getObservables(props),
          nodeSnapshot: getKubernetesNodeByHost({
            filter: {
              hostId: props.snapshotId,
              timeConfig
            }
          })
            .map(result => result.data)
            .filter(Boolean)
        }),
        render: LoggingIntegrationButtonsRenderer,
        props: {
          hostFqdn,
          hostName
        }
      }
    ];
  }
});
