import { lib_application_endpoint } from 'in-components/SvgIcon/registry';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.endpoint,

  iconSvgPath: lib_application_endpoint.path,
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
