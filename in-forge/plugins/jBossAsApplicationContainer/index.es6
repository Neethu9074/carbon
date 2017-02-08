import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/jbossDataGrid/iconPath';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.jbossas,

  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView
});

setHumanReadablePluginName(
  plugins.jbossas,
  'JBoss AS',
  'JBoss AS'
);

addLabelFinder(
  plugins.jbossas,
  snapshot => {
    const serverInfo = snapshot.getIn(['data', 'serverInfo']);

    if (!serverInfo) {
      return label;
    }

    if (serverInfo.get('nodeName')) {
      return serverInfo.get('nodeName');
    }

    if (serverInfo.get('serverName')) {
      return serverInfo.get('serverName');
    }

    let label = 'JBoss';

    if (serverInfo.get('productName')) {
      label += ' ' + serverInfo.get('productName') + ' ';
    }
    label += serverInfo.get('releaseVersion');
    const sockets = snapshot.getIn(['data', 'sockets']);
    if (sockets && sockets.size > 0) {
      label += ' @ ' + sockets.map(data => data.get('port')).join(', ');
    }
    return label;
  }
);

addSearchableEntityType('jboss', plugins.jbossas);
