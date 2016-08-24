import iconPath from 'in-forge/plugins/jBossAsApplicationContainer/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';

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

addIconToRegistry({
  id: plugins.jbossas,
  image: iconPath
});

addSearchableEntityType('jboss', plugins.jbossas);
