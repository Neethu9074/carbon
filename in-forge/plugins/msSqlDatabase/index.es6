import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.mssql,
  icon,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.mssql,
  'MsSQL Instance',
  'MsSQL Instances'
);


addLabelFinder(
  plugins.mssql,
  snapshot => 'MSSQL @' + snapshot.getIn(['data', 'instance'])
);


addSearchableEntityType('mssql', plugins.mssql);
