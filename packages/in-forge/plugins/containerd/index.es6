import { Map } from 'immutable';

import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { addMaxValueLocator, addFormattedValueLocator } from 'in-sdk/metrics';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.containerd,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Containerd Container',
    plural: 'Containerd Containers'
  },

  getContext(snapshot) {
    return Map({
      Labels: snapshot.getIn(['data', 'labels']),
      Marathon: snapshot.getIn(['data', 'Marathon', 'labels'])
    });
  }
});

addMaxValueLocator(/^memory\.usage/, snapshot => snapshot.getIn(['data', 'memory.limit']));
addMaxValueLocator(/^cpu\.total_usage/, () => 1);

addFormattedValueLocator(
  /^memory\.usage/,
  // translates free -> used -> whateverBytes
  (max, value) => bytesTwoDecimalPlaces(value)
);

addFormattedValueLocator(
  /^cpu\.total_usage/,
  // translates free -> used -> whateverBytes
  (max, value) => percentageTwoDecimalPlaces(value)
);
