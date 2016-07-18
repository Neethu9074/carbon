import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/logicalElasticSearchConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalElasticSearchConnection,
  'Logical Elasticsearch Connection',
  'Logical Elasticsearch Connections'
);

addLabelFinder(
  constants.plugins.logicalElasticSearchConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

power.addMapping(
  constants.plugins.logicalElasticSearchConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.logicalElasticSearchConnection,
  image: iconPath
});
