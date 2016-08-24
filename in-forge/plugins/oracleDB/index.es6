import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.oracledb,
  icon
});


setHumanReadablePluginName(
  plugins.oracledb,
  'OracleDB',
  'OracleDB'
);

addLabelFinder(
  plugins.oracledb,
  snapshot => 'OracleDB @' + snapshot.getIn(['data', 'databaseSID'])
);

addSearchableEntityType('oracle', plugins.oracledb);
