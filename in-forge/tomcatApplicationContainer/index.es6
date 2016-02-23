import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.tomcat,
  'Tomcat Server',
  'Tomcat Servers'
);

addLabelFinder(
  constants.plugins.tomcat,
  // Version usually looks like "Apache Tomcat/7.0"
  // So it is enough to take version + ports
  snapshot => {
    let label = snapshot.getIn(['data', 'version']);

    const connectorConfig = snapshot.getIn(['data', 'connector-config']);
    if (connectorConfig && connectorConfig.size > 0) {
      label += ' @ ' + snapshot.getIn(['data', 'connector-config'])
        .map(data => data.getIn(['port'])).join(',');
    }
    return label;
  }
);

power.addMapping(
  constants.plugins.tomcat,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.tomcat,
  image: iconPath
});
