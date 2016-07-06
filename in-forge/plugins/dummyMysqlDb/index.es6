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
import iconPath from 'in-forge/plugins/dummyMysqlDb/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.dummyMysqlDb,
  'MySQL DB',
  'MySQL DBs'
);

addLabelFinder(
  constants.plugins.dummyMysqlDb,
  snapshot => snapshot.getIn(['data', 'label'])
);

power.addMapping(
  constants.plugins.dummyMysqlDb,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.dummyMysqlDb,
  image: iconPath
});

kpi.addMapping(
  constants.plugins.dummyMysqlDb,
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
