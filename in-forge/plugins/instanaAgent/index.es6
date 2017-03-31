import { addSearchableEntityType } from 'in-sdk/search';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';
import tableDefinition from './tableDefinition';
import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.instanaAgent,

  tableDefinition,
  iconSvgPath,
  metricDefinitions,
  namesForTypeSearch: ['agent'],

  pluginName: {
    singular: 'Instana Agent',
    plural: 'Instana Agents'
  },

  getLabel() {
    return 'Instana Agent';
  }
});

addSearchableEntityType('agent', plugins.instanaAgent);
