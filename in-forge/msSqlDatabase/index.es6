import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
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
  snapshot => 'MSSQL @' + snapshot.getIn(['data', 'instance'])
);

power.addMapping(
  constants.plugins.mssql,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.mssql,
  image: iconPath
});
