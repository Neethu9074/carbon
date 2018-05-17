import { get } from 'lodash';

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { app_application } from 'in-components/SvgIcon/registry';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.application20,

  iconSvgPath: app_application,
  metricDefinitions,

  pluginName: {
    singular: 'Application',
    plural: 'Applications'
  },

  chartWiggleRoom: 20000,

  getLabel(entity) {
    return get(entity, ['data', 'label'], 'Application');
  }
});
