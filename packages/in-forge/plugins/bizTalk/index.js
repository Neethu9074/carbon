import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/bizTalk/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.bizTalk,
  pluginName: {
    singular: 'BizTalk Host',
    plural: 'BizTalk Hosts'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
