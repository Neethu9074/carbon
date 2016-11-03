import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.availabilityZone,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Availability Zone',
    plural: 'Availability Zones'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'groupId']);
  }
});
