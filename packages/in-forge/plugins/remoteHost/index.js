/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { LoggingIntegrationButtonsRenderer, getObservables } from 'in-integrations/logging/LoggingIntegrationButtons';
import agentMonitoringIssueDefinitions from 'in-forge/plugins/remoteHost/agentMonitoringIssueDefinitions';
import getKubernetesNodeByHost from 'in-kubernetes/subscriptions/getKubernetesNodeByHost';
import metricDefinitions from 'in-forge/plugins/remoteHost/metricDefinitions';
import tableDefinition from 'in-forge/plugins/remoteHost/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/remoteHost/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import 'in-forge/plugins/remoteHost/metrics';

const linuxPlugin = plugins.host + '_linux';
const zosPlugin = plugins.host + '_zos';
const applePlugin = plugins.host + '_apple';
const windowsPlugin = plugins.host + '_windows';
const aixPlugin = plugins.host + '_aix';
const solarisPlugin = plugins.host + '_solaris';

registerSnapshotDefinition({
  plugin: plugins.remoteHost,

  showZoneInSidebarHeader: true,
  tableDefinition,
  kpiDefinitions,
  agentMonitoringIssueDefinitions,
  metricDefinitions,

  getPower(snapshot) {
    const data = snapshot.get('data');
    return data.get('memory.total', 1) * data.get('cpu.count', 1);
  },

  getIconType(snapshot) {
    if (typeof snapshot === 'object') {
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
        render: props => <LoggingIntegrationButtonsRenderer {...props} addMargin />,
        props: {
          hostFqdn,
          hostName
        }
      }
    ];
  }
});
