import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.logicalCassandraKeyspace,
  icon,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Logical Cassandra Keyspace',
    plural: 'Logical Cassandra Keyspaces'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
