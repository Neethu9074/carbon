import iconPath from 'in-forge/plugins/activeMQ/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import {emptyList} from 'in-services/fixedImmutables';

pluginName.setHumanReadablePluginName(
  constants.plugins.activemq,
  'ActiveMQ',
  'ActiveMQs'
);

addLabelFinder(constants.plugins.activemq, getLabel);

power.addMapping(
  constants.plugins.activemq,
  () => -1
);

sorting.addMapping(
  constants.plugins.activemq,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

function getLabel(snapshot) {
  return '@ ' + snapshot.getIn(['data', 'ports'], emptyList).sort().join(', ');
}

addIconToRegistry({
  id: constants.plugins.activemq,
  image: iconPath
});

addSearchableType('activemq', constants.plugins.activemq);
