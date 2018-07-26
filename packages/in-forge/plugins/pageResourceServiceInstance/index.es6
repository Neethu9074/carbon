import iconSvgPath from 'in-forge/plugins/pageResourceLogicalService/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pageResourceServiceInstance,

  iconSvgPath,

  pluginName: {
    singular: 'Page Resource Service Instance',
    plural: 'Page Resource Service Instances'
  },

  chartWiggleRoom: 20000
});
