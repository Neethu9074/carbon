import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.gce,
  pluginName: {
    singular: 'GCE Instance',
    plural: 'GCE Instances'
  },

  namesForTypeSearch: ['gce'],

  icon,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'instance-id']);
  }
});
