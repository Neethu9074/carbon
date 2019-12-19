import metricDefinitions from 'in-forge/plugins/service/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/service/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/service/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.service,
  pluginName: {
    singular: 'Service',
    plural: 'Services'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  chartWiggleRoom: 20000,
  getLabel(entity) {
    return entity.get('label', 'Service');
  }
});
