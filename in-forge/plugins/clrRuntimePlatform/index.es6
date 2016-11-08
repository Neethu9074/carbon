import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.clrRuntimePlatform,
  icon,
  metricDefinitions,
  namesForTypeSearch: ['clr'],
  pluginName: {
    singular: '.NET App',
    plural: '.NET Apps'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
