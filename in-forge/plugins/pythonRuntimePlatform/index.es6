import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.python,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Python App',
    plural: 'Python Apps'
  },

  namesForTypeSearch: ['py', 'python'],

  getLabel(s) {
    return s.getIn(['data', 'snapshot.name']);
  }
});
