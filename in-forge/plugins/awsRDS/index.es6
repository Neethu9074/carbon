import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsRDS,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'AWS RDS',
    plural: 'AWS RDSes'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'db_instance_id'], '') + ' (' + snapshot.getIn(['data', 'db_engine'], '') + ')';
  }
});
