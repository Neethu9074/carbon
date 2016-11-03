import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/elasticsearchNode/icon.svg';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.elasticsearchCluster,
  icon,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.elasticsearchCluster,
  'Elasticsearch Cluster',
  'Elasticsearch Cluster'
);

addLabelFinder(plugins.elasticsearchCluster, snapshot => snapshot.getIn(['data', 'groupId']));
