/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LoggingIntegrationButtonsRenderer, getObservables } from 'in-integrations/logging/LoggingIntegrationButtons';
import getKubernetesNodeByHost from 'in-kubernetes/subscriptions/getKubernetesNodeByHost';
import metricDefinitions from 'in-forge/plugins/host/metricDefinitions';
import tableDefinition from 'in-forge/plugins/host/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/host/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import 'in-forge/plugins/host/metrics';

const linuxPlugin = plugins.host + '_linux';
const zosPlugin = plugins.host + '_zos';
const applePlugin = plugins.host + '_apple';
const windowsPlugin = plugins.host + '_windows';
const aixPlugin = plugins.host + '_aix';
const solarisPlugin = plugins.host + '_solaris';

registerSnapshotDefinition({
  plugin: plugins.otelHost,

  showZoneInSidebarHeader: true,
  tableDefinition,
  kpiDefinitions,
  metricDefinitions,

  getIconType(snapshot) {
    const os = snapshot.getIn(['data', 'os.name'], '');
    if (os.match(/aix/i)) {
      return aixPlugin;
    } else if (os.match(/solaris/i) || os.match(/sunos/i)) {
      return solarisPlugin;
    } else if (os.match(/linux/i)) {
      return linuxPlugin;
    } else if (os.match(/windows/i)) {
      return windowsPlugin;
    } else if (os.match(/mac/i)) {
      return applePlugin;
    } else if (os.match(/z\/os/i)) {
      return zosPlugin;
    }
    return linuxPlugin;
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
