import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addSearchableEntityType} from 'in-sdk/search';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.mssql,
  icon
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
