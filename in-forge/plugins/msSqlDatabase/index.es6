import { addLabelFinder, registerSnapshotDefinition } from 'in-sdk/snapshot';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.mssql,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.mssql, 'MsSQL Instance', 'MsSQL Instances');

addLabelFinder(plugins.mssql, snapshot => 'MSSQL @' + snapshot.getIn(['data', 'instance']));

addSearchableEntityType('mssql', plugins.mssql);
