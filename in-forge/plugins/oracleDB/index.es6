import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';



registerSnapshotDefinition({
  plugin: plugins.oracledb,

  iconSvgPath,
  metricDefinitions
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
