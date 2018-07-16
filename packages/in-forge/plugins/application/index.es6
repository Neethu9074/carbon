import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { app_application } from 'in-components/SvgIcon/registry';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.application,

  iconSvgPath: app_application,
  metricDefinitions,

  pluginName: {
    singular: 'Application',
    plural: 'Applications'
  },

  chartWiggleRoom: 20000,

  getLabel(entity) {
    return entity != null ? (entity.get('label') != null ? entity.get('label') : 'Application') : 'Application';
  }
});
