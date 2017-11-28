import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsEc,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'AWS EC',
    plural: 'AWS ECs'
  },
  getLabel(snapshot) {
    const clusterId = snapshot.getIn(['data', 'cache_cluster_id'], '');
    const engine = snapshot.getIn(['data', 'cache_engine'], '');

    return clusterId + ' (' + engine + ')';
  }
});
