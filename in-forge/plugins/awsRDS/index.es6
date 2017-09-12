import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsRds,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'AWS RDS',
    plural: 'AWS RDSs'
  },

  getLabel(snapshot) {
    // TODO remove
    return snapshot.getIn(['data', 'db_instance_id'], '') + ' (' + snapshot.getIn(['data', 'db_engine'], '') + ')';
  }
});
