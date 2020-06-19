import { LoggingIntegrationButtonsRenderer, getObservables } from 'in-integrations/logging/LoggingIntegrationButtons';
import getKubernetesNodeByHost from 'in-subscription/kubernetes/getKubernetesNodeByHost';
import windowsIconSvgPath from 'in-forge/plugins/host/icons/windowsIconPath';
import solarisIconPath from 'in-forge/plugins/host/icons/solarisIconPath';
import linuxIconSvgPath from 'in-forge/plugins/host/icons/linuxIconPath';
import appleIconSvgPath from 'in-forge/plugins/host/icons/appleIconPath';
import metricDefinitions from 'in-forge/plugins/host/metricDefinitions';
import zosIconSvgPath from 'in-forge/plugins/host/icons/zosIconPath';
import tableDefinition from 'in-forge/plugins/host/tableDefinition';
import aixIconPath from 'in-forge/plugins/host/icons/aixIconPath';
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
  plugin: plugins.host,
  pluginName: {
    singular: 'Host',
    plural: 'Hosts'
  },
  showZoneInSidebarHeader: true,
  tableDefinition,
  kpiDefinitions,
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
