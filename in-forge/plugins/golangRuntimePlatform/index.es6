import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.golang,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Golang App',
    plural: 'Golang Apps'
  },

  namesForTypeSearch: ['go', 'golang'],

  getLabel(s) {
    return s.getIn(['data', 'snapshot.name']);
  }
});
