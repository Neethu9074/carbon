/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import kpiDefinitions from './kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tibcoEMS,
  metricDefinitions,
  kpiDefinitions,

  technologyDescriptor: {
    label: 'Tibco EMS'
  }
});
