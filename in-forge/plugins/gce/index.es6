import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';



registerSnapshotDefinition({
  plugin: plugins.gce,
  pluginName: {
    singular: 'GCE Instance',
    plural: 'GCE Instances'
  },

  namesForTypeSearch: ['gce'],


  iconSvgPath,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'instance-id']);
  }
});
