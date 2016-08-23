import iconPath from 'in-forge/plugins/jettyApplicationContainer/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';

pluginName.setHumanReadablePluginName(
  constants.plugins.jetty,
  'Jetty',
  'Jetty'
);

addLabelFinder(
  constants.plugins.jetty,
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
  id: constants.plugins.jetty,
  image: iconPath
});
