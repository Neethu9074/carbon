import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.jetty,
  icon
});

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
