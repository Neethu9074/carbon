import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.glassfish,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Glassfish',
    plural: 'Glassfish'
  },

  namesForTypeSearch: ['glassfish']
});
