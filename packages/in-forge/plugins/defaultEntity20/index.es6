import { get } from 'lodash';

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.defaultEntity20,

  metricDefinitions,

  chartWiggleRoom: 20000,

  getLabel(entity) {
    return get(entity, ['data', 'label'], '');
  }
});
