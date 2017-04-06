import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.nova,
  pluginName: {
    singular: 'OpenStack Compute Instance',
    plural: 'OpenStack Compute Instances'
  },

  namesForTypeSearch: ['nova'],

  iconSvgPath,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'instance-id']);
  }
});
