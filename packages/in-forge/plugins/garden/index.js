/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { addMaxValueLocator, addFormattedValueLocator } from 'in-sdk/metrics';
import metricDefinitions from 'in-forge/plugins/garden/metricDefinitions';
import tableDefinition from 'in-forge/plugins/garden/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/garden/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.garden,

  kpiDefinitions,
  metricDefinitions,
  tableDefinition
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
