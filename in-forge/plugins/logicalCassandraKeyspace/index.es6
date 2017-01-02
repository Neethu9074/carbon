import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/cassandraNode/iconPath';

registerSnapshotDefinition({
  plugin: plugins.logicalCassandraKeyspace,

  iconSvgPath,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Cassandra Keyspace',
    plural: 'Cassandra Keyspaces'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
