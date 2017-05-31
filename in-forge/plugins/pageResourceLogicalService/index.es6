import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import iconSvgPath from 'in-forge/plugins/pageResourceLogicalService/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pageResourceLogicalService,
  iconSvgPath,
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'Page Assets',
    plural: 'Page Assets'
  },

  chartWiggleRoom: 20000
});
