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
import iconPath from 'in-forge/plugins/dummyTomcat/icon.svg';
import * as constants from 'in-forge/constants';


pluginName.setHumanReadablePluginName(
  constants.plugins.dummyTomcat,
  'Tomcat Server',
  'Tomcat Servers'
);

addLabelFinder(
  constants.plugins.dummyTomcat,
  snapshot => snapshot.getIn(['data', 'label'])
);

power.addMapping(
  constants.plugins.dummyTomcat,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.dummyTomcat,
  image: iconPath
});

kpi.addMapping(
  constants.plugins.dummyTomcat,
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
