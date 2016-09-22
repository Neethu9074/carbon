import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.jbossas,
  icon,
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
    let label = 'JBoss AS';
    const serverInfo = snapshot.getIn(['data', 'serverInfo']);

    if (!serverInfo) {
      return label;
    }

    label += ' ' + serverInfo.get('releaseVersion');
    if (serverInfo.get('productName')) {
      label += ' ' + serverInfo.get('productName') + ' ';
    }
    const sockets = snapshot.getIn(['data', 'sockets']);
    if (sockets && sockets.size > 0) {
      label += ' @ ' + sockets.map(data => data.get('port')).join(', ');
    }
    return label;
  }
);

addSearchableEntityType('jboss', plugins.jbossas);
