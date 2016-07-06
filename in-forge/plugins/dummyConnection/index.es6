import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';
import * as kpi from 'in-sdk/kpi';

import {
  msZeroDecimalPlaces,
  zeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import iconPath from 'in-forge/plugins/dummyConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.dummyConnection,
  'Connection',
  'Connections'
);

addLabelFinder(
  constants.plugins.dummyConnection,
  snapshot => snapshot.getIn(['data', 'label'])
);

power.addMapping(
  constants.plugins.dummyConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.dummyConnection,
  image: iconPath
});

kpi.addMapping(
  constants.plugins.dummyConnection,
  () => [{
    metric: 'METRIC_NAME_HERE',
    label: 'calls/s',
    formatter: zeroDecimalPlaces
  }, {
    metric: 'METRIC_NAME_HERE',
    label: 'latency',
    formatter: msZeroDecimalPlaces
  }, {
    metric: 'errors',
    label: 'errors',
    formatter: percentageTwoDecimalPlaces
  }, {
    metric: 'sessions',
    label: 'sessions',
    formatter: zeroDecimalPlaces
  }]
);
