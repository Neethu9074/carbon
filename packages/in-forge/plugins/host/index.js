import React from 'react';

import LoggingIntegrationButtons from 'in-forge/plugins/host/Dashboard/LogggingIntegrationButtons';
import windowsIconSvgPath from 'in-forge/plugins/host/icons/windowsIconPath';
import solarisIconPath from 'in-forge/plugins/host/icons/solarisIconPath';
import linuxIconSvgPath from 'in-forge/plugins/host/icons/linuxIconPath';
import appleIconSvgPath from 'in-forge/plugins/host/icons/appleIconPath';
import metricDefinitions from 'in-forge/plugins/host/metricDefinitions';
import zosIconSvgPath from 'in-forge/plugins/host/icons/zosIconPath';
import tableDefinition from 'in-forge/plugins/host/tableDefinition';
import aixIconPath from 'in-forge/plugins/host/icons/aixIconPath';
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
  plugin: plugins.host,
  pluginName: {
    singular: 'Host',
    plural: 'Hosts'
  },
  showZoneInSidebarHeader: true,
  tableDefinition,
  metricDefinitions,

  icons: {
    [plugins.host]: linuxIconSvgPath,
    [linuxPlugin]: linuxIconSvgPath,
    [applePlugin]: appleIconSvgPath,
    [windowsPlugin]: windowsIconSvgPath,
    [aixPlugin]: aixIconPath,
    [solarisPlugin]: solarisIconPath,
    [zosPlugin]: zosIconSvgPath
  },

  getIconPath(snapshot) {
    const os = snapshot.getIn(['data', 'os.name'], '');
    if (os.match(/aix/i)) {
      return aixPlugin;
    } else if (os.match(/solaris/i)) {
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

  getPower(snapshot) {
    const data = snapshot.get('data');
    return data.get('memory.total', 1) * data.get('cpu.count', 1);
  },

  DashboardHeaderActions({ snapshot, timeConfig }) {
    let hostFqdn = snapshot.getIn(['data', 'fqdn']);
    if (!hostFqdn) {
      hostFqdn = snapshot.getIn(['data', 'hostname']);
    }

    return <LoggingIntegrationButtons snapshotId={snapshot.get('id')} hostFqdn={hostFqdn} timeConfig={timeConfig} />;
  }
});
