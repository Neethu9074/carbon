import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { addMaxValueLocator, addFormattedValueLocator } from 'in-sdk/metrics';
import tableDefinition from 'in-forge/plugins/garden/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.garden,
  iconSvgPath,
  metricDefinitions,
  tableDefinition,

  pluginName: {
    singular: 'Garden Container',
    plural: 'Garden Containers'
  }
});

addMaxValueLocator(/^memory\.usage/, snapshot => snapshot.getIn(['data', 'memory.limit']));
addMaxValueLocator(/^cpu\.total/, () => 1);

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
