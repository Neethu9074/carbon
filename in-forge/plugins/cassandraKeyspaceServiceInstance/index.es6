import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/cassandraNode/icon.svg';

registerSnapshotDefinition({
  plugin: plugins.cassandraKeyspaceServiceInstance,
  icon,

  pluginName: {
    singular: 'Cassandra Keyspace Instance',
    plural: 'Cassandra Keyspace Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
