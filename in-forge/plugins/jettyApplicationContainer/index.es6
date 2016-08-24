import iconPath from 'in-forge/plugins/jettyApplicationContainer/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';

setHumanReadablePluginName(
  plugins.jetty,
  'Jetty',
  'Jetty'
);

addLabelFinder(
  plugins.jetty,
  snapshot => {
    let label = 'Jetty';
    const connectors = snapshot.getIn(['data', 'connectors']);
    if (connectors) {
      label += ' @' + connectors.map(connector => connector.get('port')).join(', ');
    }
    return label;
  }
);

addIconToRegistry({
  id: plugins.jetty,
  image: iconPath
});
