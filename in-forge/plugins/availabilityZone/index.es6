import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';


registerSnapshotDefinition({
  plugin: plugins.availabilityZone,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Availability Zone',
    plural: 'Availability Zones'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'groupId']);
  }
});
