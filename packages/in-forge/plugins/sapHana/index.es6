import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.sapHana,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'SAP HANA',
    plural: 'SAP HANA'
  }
});
