import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';



registerSnapshotDefinition({
  plugin: plugins.instanaAgent,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Instana Agent',
    plural: 'Instana Agents'
  },

  getLabel() {
    return 'Instana Agent';
  }
});
