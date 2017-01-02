import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';



registerSnapshotDefinition({
  plugin: plugins.cassandra,

  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView
});

setHumanReadablePluginName(
  plugins.cassandra,
  'Cassandra Node',
  'Cassandra Nodes'
);

addLabelFinder(
  plugins.cassandra,
  snapshot => snapshot.getIn(['data', 'clusterName'])
              + '-'
              + snapshot.getIn(['data', 'hostId'])
);

addSearchableEntityType('cassandra', plugins.cassandra);
