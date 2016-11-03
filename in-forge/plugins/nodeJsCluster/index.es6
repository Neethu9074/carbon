import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/nodeJsRuntimePlatform/icon.svg';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.nodejsCluster,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Node.js Cluster',
    plural: 'Node.js Clusters'
  },

  namesForTypeSearch: ['nodeCluster', 'node.jsCluster', 'nodejsCluster'],

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'groupId']);
  }
});
