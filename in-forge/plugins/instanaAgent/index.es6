import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.instanaAgent,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Instana Agent',
    plural: 'Instana Agents'
  },

  getLabel() {
    return 'Instana Agent';
  }
});
