import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-sdk/unknownIconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.logicalFtpService,

  iconSvgPath,
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'FTP Server',
    plural: 'FTP Servers'
  },

  chartWiggleRoom: 20000
});
