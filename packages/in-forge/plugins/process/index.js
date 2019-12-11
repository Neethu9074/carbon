import { Map } from 'immutable';

import tableDefinition from 'in-forge/plugins/process/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import kpiDefinitions from 'in-forge/plugins/process';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.process,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  tableDefinition,
  pluginName: {
    singular: 'Process',
    plural: 'Processes'
  },

  getContext(snapshot) {
    return Map({
      Environment: snapshot.getIn(['data', 'env'])
    });
  }
});
