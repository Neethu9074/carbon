import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { app_endpoint } from 'in-components/SvgIcon/registry';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.endpoint,

  iconSvgPath: app_endpoint.path,
  metricDefinitions,

  pluginName: {
    singular: 'Endpoint',
    plural: 'Endpoints'
  },

  chartWiggleRoom: 20000,

  getLabel(entity) {
    return entity.get('label', 'Endpoint');
  }
});
