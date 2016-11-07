import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/cassandraNode/icon.svg';

registerSnapshotDefinition({
  plugin: plugins.logicalCassandraKeyspace,
  icon,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Cassandra Keyspace',
    plural: 'Cassandra Keyspaces'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
