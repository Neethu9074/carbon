import {
  addLabelFinder,
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.mssql,
  'MsSQL Instance',
  'MsSQL Instances'
);


addLabelFinder(
  constants.plugins.mssql,
  snapshot => 'MSSQL @' + snapshot.getIn(['data', 'instancename'])
);

addIconFinder(
  constants.plugins.mssql,
  () => iconPath
);

power.addMapping(
  constants.plugins.mssql,
  () => -1
);
