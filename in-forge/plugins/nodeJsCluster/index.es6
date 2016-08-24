import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.nodejsCluster,
  icon,

  pluginName: {
    singular: 'Node.js Cluster',
    plural: 'Node.js Clusters'
  },

  namesForTypeSearch: ['nodeCluster', 'node.jsCluster', 'nodejsCluster'],

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'groupId']);
  }
});
