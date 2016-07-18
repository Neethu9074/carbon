import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/physicalElasticSearchConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.physicalElasticSearchConnection,
  'Physical Elasticsearch Connection',
  'Physical Elasticsearch Connections'
);

addLabelFinder(
  constants.plugins.physicalElasticSearchConnection,
  snapshot => snapshot.getIn(['data', 'source', 'id']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'id'])
);

power.addMapping(
  constants.plugins.physicalElasticSearchConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.physicalElasticSearchConnection,
  image: iconPath
});
