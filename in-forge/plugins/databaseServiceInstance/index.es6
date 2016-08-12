import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as icon from 'in-sdk/iconRegistry';

import * as constants from 'in-forge/constants';

import postgresIcon from 'in-forge/plugins/postgreSqlDatabase/icon.svg';
import mysqlIcon from 'in-forge/plugins/mySqlDatabase/icon.svg';

import iconPath from './icon.svg';


pluginName.setHumanReadablePluginName(
  constants.plugins.databaseServiceInstance,
  'Database Instance',
  'Database Instances'
);

addLabelFinder(
  constants.plugins.databaseServiceInstance,
  snapshot => snapshot.getIn(['data', 'name'])
);

icon.addIconsToRegistry([ {
    id: constants.plugins.databaseServiceInstance + '_mysql',
    image: mysqlIcon
  }, {
    id: constants.plugins.databaseServiceInstance + '_postgres',
    image: postgresIcon
  }, {
    id: constants.plugins.databaseServiceInstance,
    image: iconPath
  }
]);

icon.addMapping(
  constants.plugins.databaseServiceInstance,
  snapshot => {
    let type = snapshot.get('plugin');

    const databasePlugin = constants.plugins.databaseServiceInstance;
    if (type === databasePlugin) {
      type = databasePlugin; // linux as default
      const databaseType = snapshot.getIn(['data', 'physical_endpoint', 'type']);

      if (databaseType) {
        if (databaseType.match(/mysql/i)) {
          type = databasePlugin + '_mysql';
        } else if (databaseType.match(/postgres/i)) {
          type = databasePlugin + '_postgres';
        }
      }
    }
    return type;
  }
);
