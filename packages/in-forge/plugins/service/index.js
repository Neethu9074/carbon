import { lib_application_service } from 'in-components/SvgIcon/registry';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.service,

  iconSvgPath: lib_application_service.path,
  metricDefinitions,

  pluginName: {
    singular: 'Service',
    plural: 'Services'
  },

  chartWiggleRoom: 20000,

  getLabel(entity) {
    return entity.get('label', 'Service');
  }
});
