import { Map } from 'immutable';

import metricDefinitions from 'in-forge/plugins/process/metricDefinitions';
import tableDefinition from 'in-forge/plugins/process/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/process/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/process/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.process,
  pluginName: {
    singular: 'Process',
    plural: 'Processes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  tableDefinition,

  getContext(snapshot) {
    return Map({
      Environment: snapshot.getIn(['data', 'env'])
    });
  }
});
