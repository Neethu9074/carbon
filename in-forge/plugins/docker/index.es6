import tableDefinition from 'in-forge/plugins/docker/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.docker,

  iconSvgPath,
  metricDefinitions,
  tableDefinition,
  namesForTypeSearch: ['docker'],

  pluginName: {
    singular: 'Docker Container',
    plural: 'Docker Containers'
  }
});
