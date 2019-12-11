import { get } from 'lodash';

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/defaultEntity20/kpiDefinitions';

registerSnapshotDefinition({
  plugin: plugins.defaultEntity20,
  kpiDefinitions,
  metricDefinitions,

  chartWiggleRoom: 20000,

  getLabel(entity) {
    return get(entity, ['data', 'label'], '');
  }
});
