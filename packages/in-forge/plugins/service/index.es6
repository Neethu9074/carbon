import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { app_service } from 'in-components/SvgIcon/registry';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.service,

  iconSvgPath: app_service,
  metricDefinitions,

  pluginName: {
    singular: 'Service',
    plural: 'Services'
  },

  chartWiggleRoom: 20000,

  getLabel(entity) {
    return entity != null ? (entity.get('label') != null ? entity.get('label') : 'Service') : 'Service';
  }
});
