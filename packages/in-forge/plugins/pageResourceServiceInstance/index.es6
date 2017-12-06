import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import iconSvgPath from 'in-forge/plugins/pageResourceLogicalService/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pageResourceServiceInstance,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Page Resource Group Instance',
    plural: 'Page Resource Group Instances'
  },

  chartWiggleRoom: 20000
});
